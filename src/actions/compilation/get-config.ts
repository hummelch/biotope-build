import { existsSync } from 'fs';

const CONFIG_DEFAULT = 'biotope-build.config.js';

export const getConfig = (config?: string) => {
  const configFile = `${process.cwd()}/${config || CONFIG_DEFAULT}`;
  return existsSync(configFile) ? require(configFile) : {};
};
