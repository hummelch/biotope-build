import { Configuration } from 'webpack';

import { Options, WebpackConfig, NodeEnvironment } from './settings';

export * from './settings';

export const webpackInit = (environment: NodeEnvironment, options: Options): Configuration => {
  process.env.NODE_ENV = environment;

  // tslint:disable-next-line:no-require-imports
  return (require(`./${environment}.config`).config as WebpackConfig)({
    ...options,
    environment,
  });
};
