import { readFileSync } from 'fs';
import { resolve } from 'path';
import { loader } from 'webpack';
import * as loaderUtils from 'loader-utils';

import { biotopeLibPath } from './project-paths';

const LOADER_CONTENT_FILE = resolve(`${biotopeLibPath}/webpack/settings/style-loader-content.js`);

// tslint:disable-next-line:no-empty
const styleLoader: loader.Loader = function() {};

styleLoader.pitch = function(request: string) {
  // tslint:disable-next-line:no-any
  const context = this as any as loader.LoaderContext;
  const content = readFileSync(LOADER_CONTENT_FILE, 'utf8');

  return content.replace('__STYLE__', loaderUtils.stringifyRequest(context, `!!${request}`));
};

module.exports = styleLoader;
