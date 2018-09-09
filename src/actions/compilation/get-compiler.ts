import * as webpack from 'webpack';

import { ProjectEnvironment, Options } from '../../webpack';
import { getConfig } from './get-config';

const ENVIRONMENT_DEFAULT = 'dev';

export interface CompileOptions {
  config?: string;
  environment?: ProjectEnvironment;
  watch?: boolean;
}

export type WebpackInit = (env: ProjectEnvironment, data: Options) => webpack.Configuration;

export const getCompiler = ({ config, environment }: CompileOptions, webpackInit: WebpackInit) => {
  const compiler = webpack(webpackInit(environment || ENVIRONMENT_DEFAULT, getConfig(config)));
  (new webpack.ProgressPlugin()).apply(compiler);

  return compiler;
};
