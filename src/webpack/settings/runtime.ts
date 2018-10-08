import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as mergeDeep from 'merge-deep';
import { parse } from 'dotenv';

import { Settings, NodeEnvironment } from './types';

const getDotEnv = (paths: Settings['paths']) => {
  try {
    return parse(readFileSync(resolve(`${paths.baseAbsolute}/.env`)));
  } catch (_) {
    return {};
  }
};

const filterEnvironments = (runtimeVariables: IndexObjectAny) => Object.keys(runtimeVariables)
  .filter(key => key !== 'local' && key !== 'development' && key !== 'production')
  .reduce((accumulator, key) => ({
    ...accumulator,
    [key]: runtimeVariables[key],
  }), {});

export const getRuntime = (
  runtime: IndexObjectAny,
  environment: NodeEnvironment,
  paths: Settings['paths'],
) => mergeDeep(mergeDeep(filterEnvironments(runtime), runtime[environment]), getDotEnv(paths));
