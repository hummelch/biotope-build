import { existsSync } from 'fs';

import { Options } from '../../webpack';

const CONFIG_DEFAULT = 'biotope-build.config.js';

export const getConfig = (config?: string): Options => {
  const configFile = `${process.cwd()}/${config || CONFIG_DEFAULT}`;
  return existsSync(configFile) ? require(configFile) : {};
};
