import { useCallback } from 'react';
import ExperimentalFeature from '../experimental-feature';
import { useDepGraphService } from '../hooks/use-dep-graph';
import { useDepGraphSelector } from '../hooks/use-dep-graph-selector';
import {
  collapseEdgesSelector,
  focusedProjectNameSelector,
  getTracingInfo,
  groupByFolderSelector,
  hasAffectedProjectsSelector,
  includePathSelector,
  searchDepthSelector,
  textFilterSelector,
} from '../machines/selectors';
import { tracingStateConfig } from '../machines/tracing.state';
import CollapseEdgesPanel from './collapse-edges-panel';
import FocusedProjectPanel from './focused-project-panel';
import GroupByFolderPanel from './group-by-folder-panel';
import ProjectList from './project-list';
import SearchDepth from './search-depth';
import ShowHideProjects from './show-hide-projects';
import TextFilterPanel from './text-filter-panel';
import TracingPanel from './tracing-panel';
import ThemePanel from './theme-panel';
import { useEnvironmentConfig } from '../hooks/use-environment-config';

export function Sidebar() {
  const depGraphService = useDepGraphService();
  const focusedProject = useDepGraphSelector(focusedProjectNameSelector);
  const searchDepthInfo = useDepGraphSelector(searchDepthSelector);
  const includePath = useDepGraphSelector(includePathSelector);
  const textFilter = useDepGraphSelector(textFilterSelector);
  const hasAffectedProjects = useDepGraphSelector(hasAffectedProjectsSelector);
  const groupByFolder = useDepGraphSelector(groupByFolderSelector);
  const collapseEdges = useDepGraphSelector(collapseEdgesSelector);
  const environment = useEnvironmentConfig();

  const { showExperimentalFeatures } = environment.appConfig;

  // const isTracing = depGraphService.state.matches('tracing');
  const tracingInfo = useDepGraphSelector(getTracingInfo);

  function resetFocus() {
    depGraphService.send({ type: 'unfocusProject' });
  }

  function showAllProjects() {
    depGraphService.send({ type: 'selectAll' });
  }

  function hideAllProjects() {
    depGraphService.send({ type: 'deselectAll' });
  }

  function showAffectedProjects() {
    depGraphService.send({ type: 'selectAffected' });
  }

  function searchDepthFilterEnabledChange(checked: boolean) {
    depGraphService.send({
      type: 'setSearchDepthEnabled',
      searchDepthEnabled: checked,
    });
  }

  function groupByFolderChanged(checked: boolean) {
    depGraphService.send({ type: 'setGroupByFolder', groupByFolder: checked });
  }

  function collapseEdgesChanged(checked: boolean) {
    depGraphService.send({ type: 'setCollapseEdges', collapseEdges: checked });
  }

  function incrementDepthFilter() {
    depGraphService.send({ type: 'incrementSearchDepth' });
  }

  function decrementDepthFilter() {
    depGraphService.send({ type: 'decrementSearchDepth' });
  }

  function resetTextFilter() {
    depGraphService.send({ type: 'clearTextFilter' });
  }

  function includeLibsInPathChange() {
    depGraphService.send({
      type: 'setIncludeProjectsByPath',
      includeProjectsByPath: !includePath,
    });
  }

  function resetTraceStart() {
    depGraphService.send({ type: 'clearTraceStart' });
  }

  function resetTraceEnd() {
    depGraphService.send({ type: 'clearTraceEnd' });
  }

  const updateTextFilter = useCallback(
    (textFilter: string) => {
      depGraphService.send({ type: 'filterByText', search: textFilter });
    },
    [depGraphService]
  );

  return (
    <div
      className="
    dark:bg-sidebar-dark relative
    relative
    flex
    h-full
    w-72
    flex-col
    overflow-y-scroll
    pb-10 shadow-lg ring-1
    ring-gray-400
    ring-opacity-10
    transition-all
  "
      id="sidebar"
    >
      <div className="bg-blue-nx-base">
        <div
          className={`mx-4 my-5 flex items-center text-white ${
            showExperimentalFeatures ? 'justify-between' : 'justify-start'
          }`}
        >
          <svg
            className="h-10 w-auto"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Nx</title>
            <path d="M11.987 14.138l-3.132 4.923-5.193-8.427-.012 8.822H0V4.544h3.691l5.247 8.833.005-3.998 3.044 4.759zm.601-5.761c.024-.048 0-3.784.008-3.833h-3.65c.002.059-.005 3.776-.003 3.833h3.645zm5.634 4.134a2.061 2.061 0 0 0-1.969 1.336 1.963 1.963 0 0 1 2.343-.739c.396.161.917.422 1.33.283a2.1 2.1 0 0 0-1.704-.88zm3.39 1.061c-.375-.13-.8-.277-1.109-.681-.06-.08-.116-.17-.176-.265a2.143 2.143 0 0 0-.533-.642c-.294-.216-.68-.322-1.18-.322a2.482 2.482 0 0 0-2.294 1.536 2.325 2.325 0 0 1 4.002.388.75.75 0 0 0 .836.334c.493-.105.46.36 1.203.518v-.133c-.003-.446-.246-.55-.75-.733zm2.024 1.266a.723.723 0 0 0 .347-.638c-.01-2.957-2.41-5.487-5.37-5.487a5.364 5.364 0 0 0-4.487 2.418c-.01-.026-1.522-2.39-1.538-2.418H8.943l3.463 5.423-3.379 5.32h3.54l1.54-2.366 1.568 2.366h3.541l-3.21-5.052a.7.7 0 0 1-.084-.32 2.69 2.69 0 0 1 2.69-2.691h.001c1.488 0 1.736.89 2.057 1.308.634.826 1.9.464 1.9 1.541a.707.707 0 0 0 1.066.596zm.35.133c-.173.372-.56.338-.755.639-.176.271.114.412.114.412s.337.156.538-.311c.104-.231.14-.488.103-.74z" />
          </svg>
          <span className="ml-4 text-xl font-medium"> Project Graph </span>
          <ExperimentalFeature>
            <ThemePanel />
          </ExperimentalFeature>
        </div>
      </div>

      <a
        id="help"
        className="
      dark:text-sidebar-text-dark
      mt-3
      flex cursor-pointer
      items-center
      px-4
      text-xs
      text-gray-500
      hover:underline
    "
        href="https://nx.dev/structure/dependency-graph"
        rel="nofollow noreferrer"
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Analyse and visualize your workspace.
      </a>

      {focusedProject ? (
        <FocusedProjectPanel
          focusedProject={focusedProject}
          resetFocus={resetFocus}
        ></FocusedProjectPanel>
      ) : null}

      <ExperimentalFeature>
        <TracingPanel
          start={tracingInfo.start}
          end={tracingInfo.end}
          resetStart={resetTraceStart}
          resetEnd={resetTraceEnd}
        ></TracingPanel>
      </ExperimentalFeature>

      <TextFilterPanel
        includePath={includePath}
        resetTextFilter={resetTextFilter}
        textFilter={textFilter}
        toggleIncludeLibsInPathChange={includeLibsInPathChange}
        updateTextFilter={updateTextFilter}
      ></TextFilterPanel>

      <div>
        <ShowHideProjects
          hideAllProjects={hideAllProjects}
          showAllProjects={showAllProjects}
          showAffectedProjects={showAffectedProjects}
          hasAffectedProjects={hasAffectedProjects}
        ></ShowHideProjects>

        <GroupByFolderPanel
          groupByFolder={groupByFolder}
          groupByFolderChanged={groupByFolderChanged}
        ></GroupByFolderPanel>

        <SearchDepth
          searchDepth={searchDepthInfo.searchDepth}
          searchDepthEnabled={searchDepthInfo.searchDepthEnabled}
          searchDepthFilterEnabledChange={searchDepthFilterEnabledChange}
          incrementDepthFilter={incrementDepthFilter}
          decrementDepthFilter={decrementDepthFilter}
        ></SearchDepth>

        <ExperimentalFeature>
          <div data-cy="experimental-features" className="bg-purple-200 pb-2">
            <h3 className="mt-4 cursor-text px-4 py-2 text-sm font-semibold uppercase tracking-wide text-gray-900 lg:text-xs ">
              Experimental Features
            </h3>
            <CollapseEdgesPanel
              collapseEdges={collapseEdges}
              collapseEdgesChanged={collapseEdgesChanged}
            ></CollapseEdgesPanel>
          </div>
        </ExperimentalFeature>
      </div>

      <ProjectList></ProjectList>
    </div>
  );
}

export default Sidebar;
