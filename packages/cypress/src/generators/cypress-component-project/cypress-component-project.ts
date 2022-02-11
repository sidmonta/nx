import { CypressComponentProjectSchema } from './schema';
import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { join } from 'path';
import {
  cypressReactVersion,
  cypressVersion,
  cypressWebpackVersion,
  swcCoreVersion,
  swcLoaderVersion,
  webpackHttpPluginVersion,
} from '../../utils/versions';
import { installedCypressVersion } from '../../utils/cypress-version';
import { CYPRESS_COMPONENT_TEST_TARGET_NAME } from '@nrwl/cypress/src/utils/project-name';

function verifyProject(
  tree: Tree,
  options: CypressComponentProjectSchema,
  projectConfig: ProjectConfiguration
): boolean {
  // if the project already has the component testing target or a cypress.config.ts file then we make sure the --force flag is sent. if not, we throw an error.
  if (
    projectConfig.targets?.[CYPRESS_COMPONENT_TEST_TARGET_NAME] ||
    tree.exists(joinPathFragments(projectConfig.root, 'cypress.config.ts'))
  ) {
    if (!options.force) {
      throw new Error(
        `The project already has a cypress component testing target. Please use the --force flag to overwrite the existing project.`
      );
    }
  }

  const installedVersion = installedCypressVersion();
  // if we don't have a version then it's safe to install cypress
  if (!installedVersion) {
    return true;
  }

  if (installedVersion >= 10) {
    return false;
  }

  throw new Error('Cypress version 10 or greater is required ');
}

export async function cypressComponentProject(
  tree: Tree,
  options: CypressComponentProjectSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  const shouldInstallCypress = verifyProject(tree, options, projectConfig);

  generateFiles(tree, join(__dirname, 'files'), projectConfig.root, {
    ...options,
    projectRoot: projectConfig.root,
    offsetFromRoot: offsetFromRoot(projectConfig.root),
    ext: '',
  });

  // TODO(caleb): this probably fragile,
  //  is there a way to grab the projects base tsconfig?
  const projectTsConfigPath = joinPathFragments(
    projectConfig.root,
    'tsconfig.json'
  );
  updateJson(tree, projectTsConfigPath, (json) => {
    json?.references?.push({ path: './tsconfig.cy.json' });
    return json;
  });

  projectConfig.targets[CYPRESS_COMPONENT_TEST_TARGET_NAME] = {
    executor: '@nrwl/cypress:cypress',
    options: {
      cypressConfig: joinPathFragments(projectConfig.root, 'cypress.config.ts'),
      testingType: 'component',
    },
  };

  updateProjectConfiguration(tree, options.project, projectConfig);

  const devDeps = {
    '@cypress/webpack-dev-server': cypressWebpackVersion,
    'html-webpack-plugin': webpackHttpPluginVersion,
  };

  if (shouldInstallCypress) {
    devDeps['cypress'] = cypressVersion;
  }

  if (options.componentType === 'react') {
    devDeps['@cypress/react'] = cypressReactVersion;
    if (options.compiler === 'swc') {
      devDeps['@swc/core'] = swcCoreVersion;
      devDeps['swc-loader'] = swcLoaderVersion;
    }
  }

  const installDeps = addDependenciesToPackageJson(tree, {}, devDeps);

  return () => {
    formatFiles(tree);
    installDeps();
  };
}
