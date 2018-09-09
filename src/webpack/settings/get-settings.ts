import { resolve } from 'path';
import * as mergeDeep from 'merge-deep';
import { PuppeteerRenderer as Renderer } from 'prerender-spa-plugin';

import { Options, Settings } from './types';
import { getFavicons } from './favicons';
import { getPaths } from './paths';
import { getRules } from './rules';

const defaultKeywords = ['biotope', 'boilerplate', 'modern', 'framework', 'html5'];

export const getSettings = (options: Options): Settings => {
  const paths = getPaths(options.paths);
  const minify = !!options.minify;
  const webpack = (options.webpack || {});
  const entryPoints = webpack.entryPoints || {
    app: 'index.ts',
  };

  return {
    app: {
      title: 'Biotope Boilerplate v7',
      description: 'Modern HTML5 UI Framework',
      author: 'Biotope',
      ...(options.app || {}),
      keywords: (((options.app || {}).keywords || defaultKeywords)).join(','),
      filename: resolve(`${paths.distAbsolute}/index.html`),
      template: resolve(
        `${paths.baseAbsolute}/${webpack.template || './src/resources/.index.ejs'}`,
      ),
      ...(minify ? {
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          quoteCharacter: '"',
          removeComments: true,
        },
      } : {}),
    },
    environment: options.environment || 'dev',
    minify,
    overrides: options.overrides || (s => s),
    paths,
    runtime: (options.runtime || {})[options.environment || 'dev'] || options.runtime || {},
    webpack: {
      alias: webpack.alias || {},
      cleanExclusions: webpack.cleanExclusions || [],
      disablePlugins: webpack.disablePlugins || [],
      entryPoints: Object.keys(entryPoints).reduce((accumulator, key) => ({
        ...accumulator,
        [key]: `${paths.pagesRelative}/${entryPoints[key]}`,
      }), {}),
      externalFiles: (webpack.externalFiles || ['./src/resources'])
        .map(files => typeof files === 'string' ? resolve(files) : ({
          ...files,
          from: resolve(files.from),
        })),
      favicons: getFavicons(options.webpack, minify),
      output: mergeDeep({}, {
        script: '[name].js',
        style: '[name].css',
      }, webpack.output || {}),
      rules: getRules(minify, webpack.disablePlugins || []),
      commonChunk: {
        test: /node_modules/,
        name: 'vendor',
        chunks: 'initial',
      },
      rendering: {
        staticDir: paths.distAbsolute,
        routes: (options.webpack || {}).renderRoutes || ['/'],
        server: { port: 8001 },
        renderer: new Renderer({
          args: ['–no-sandbox', '–disable-setuid-sandbox'],
        }),
      },
    },
  };
};
