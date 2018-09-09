"use strict";
// import { Configuration, NoEmitOnErrorsPlugin } from 'webpack';
// import * as HtmlWebpackPlugin from 'html-webpack-plugin';
// import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin';
// import * as ManifestJsonWebpackPlugin from 'manifest-json-webpack-plugin';
// import * as ExtendedDefinePlugin from 'extended-define-webpack-plugin';
// import * as PrerenderSpaPlugin from 'prerender-spa-plugin';
// import * as mergeDeep from 'merge-deep';
// import {
//   app,
//   favicon,
//   manifest,
//   page,
//   rules,
// } from './settings';
// import { baseConfig } from './base.config';
// export const config = (
//   runtime: any,
//   project: any,
//   webpack: any,
// ): Configuration => webpack(mergeDeep({}, project, baseConfig, {
//   devtool: false,
//   mode: 'production',
//   module: { rules: rules.minified },
//   optimization: {
//     minimize: true,
//   },
//   plugins: [
//     new HtmlWebpackPlugin(page.minified),
//     new FaviconsWebpackPlugin(favicon.all),
//     new ManifestJsonWebpackPlugin(manifest.minified),
//     new ExtendedDefinePlugin(runtime),
//     new PrerenderSpaPlugin(app.rendering),
//     new NoEmitOnErrorsPlugin(),
//   ],
// }));
