import { Configuration } from 'webpack';

import { environments, ProjectEnvironment } from './environments';
import { Options, WebpackConfig } from './settings';

export * from './settings/types';

export const webpackInit = (environment: ProjectEnvironment, options: Options): Configuration => {
  const actualEnv = environments[environment] || environments.default;
  process.env.NODE_ENV = actualEnv;

  // tslint:disable-next-line:no-require-imports
  return (require(`./${actualEnv}.config`).config as WebpackConfig)(options);
};
