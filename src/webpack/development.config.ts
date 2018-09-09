import { Configuration } from 'webpack';
// import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import * as ExtendedDefinePlugin from 'extended-define-webpack-plugin';
// import * as PrerenderSpaPlugin from 'prerender-spa-plugin';
import * as mergeDeep from 'merge-deep';

import { Options } from './settings';
import { baseConfig } from './base.config';

export const config = (options: Options): Configuration => {
  const [configuration, { runtime, overrides }] = baseConfig(options);
  return overrides(mergeDeep({}, configuration, {
    plugins: [
      // new FaviconsWebpackPlugin(favicon.all),
      new ExtendedDefinePlugin(runtime),
      // new PrerenderSpaPlugin(app.rendering),
    ],
  }), mergeDeep);
};
