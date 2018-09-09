import { resolve } from 'path';
import * as mergeDeep from 'merge-deep';

import { Options } from './types';

const pathDefaults = {
  app: './src/',
  dist: './dist/',
  pagesRelative: 'pages/',
  buildRelative: 'build/',
};

const baseAbsolute = resolve('./');

export const getPaths = (paths: Options['paths'] = {}) => {
  const pathsDefined = mergeDeep({}, pathDefaults, paths);
  return {
    ...pathsDefined,
    baseAbsolute,
    appAbsolute: resolve(`${baseAbsolute}/${pathsDefined.app}`),
    distAbsolute: resolve(`${baseAbsolute}/${pathsDefined.dist}`),
    buildAbsolute: resolve(`${baseAbsolute}/${pathsDefined.dist}/${pathsDefined.buildRelative}`),
  };
};
