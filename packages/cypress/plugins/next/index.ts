import { Configuration } from 'webpack';

export function componentDevServer(
  tsConfigPath = 'tsconfig.spec.json',
  compiler: 'swc' | 'babel' = 'swc',
  extendWebPackConfig?: (config: Configuration) => Configuration
) {
  const webpackConfig = require('next/dist/compiled/webpack/webpack');
}
