import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'dotenv';

import { Settings } from './types';

export const getDotEnv = (paths: Settings['paths']) => {
  try {
    return parse(readFileSync(resolve(`${paths.baseAbsolute}/.env`)));
  } catch (_) {
    return {};
  }
};
