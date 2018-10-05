import { existsSync } from 'fs';
import { resolve } from 'path';
import { Rule } from 'webpack';
import { loader as ExtractLoader } from 'mini-css-extract-plugin';

const projectPath = resolve(process.cwd());
const biotopeBuildPath = resolve(`${projectPath}/node_modules/@biotope/build`);

const babelPath = existsSync(`${projectPath}/.babelrc.js`)
  ? `${projectPath}/.babelrc.js`
  : `${biotopeBuildPath}/.babelrc.js`;

// tslint:disable-next-line:no-require-imports no-var-requires
const babelOptions = require(babelPath);

const postCssPath = existsSync(`${projectPath}/postcss.config.js`)
  ? `${projectPath}/`
  : `${biotopeBuildPath}/`;

export const getRules = (
  minify: boolean,
  disabledPlugins: string[],
  compileExclusions: string[],
): Rule[] => ([
  {
    test: /\.(js|tsx?)$/,
    use: {
      loader: 'babel-loader',
      options: babelOptions,
    },
    ...(compileExclusions.length
      ? { exclude: new RegExp(`node_modules/(${compileExclusions.join('|')})`) }
      : {}),
  },
  {
    test: /\.scss$/,
    use: [
      ...(disabledPlugins.indexOf('mini-css-extract-plugin') < 0 ? [ExtractLoader] : []),
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          minimize: minify,
          localIdentName: minify ? '[hash:base64:24]' : '[path][name]-[local]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: { path: postCssPath },
        },
      },
      'sass-loader',
    ],
  },
  {
    test: /\.svg/,
    use: 'raw-loader',
  },
]);
