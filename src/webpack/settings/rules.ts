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

const typescriptExistsBaseConfig = existsSync(`${projectPath}/tsconfig.json`);
const typescriptExistsProdConfig = existsSync(`${projectPath}/tsconfig.prod.json`);
const typescriptGetPath = (minify: boolean): string => {
  if (!minify || (minify && !typescriptExistsProdConfig)) {
    return typescriptExistsBaseConfig
      ? `${projectPath}/tsconfig.json`
      : `${biotopeBuildPath}/tsconfig.base.json`;
  }
  return `${biotopeBuildPath}/tsconfig.prod.json`;
};

const postCssPath = existsSync(`${projectPath}/postcss.config.js`)
  ? `${projectPath}/`
  : `${biotopeBuildPath}/`;

export const getRules = (minify: boolean, disabledPlugins: string[]): Rule[] => ([
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: babelOptions,
    },
  },
  {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: babelOptions,
      },
      {
        loader: 'ts-loader',
        options: {
          configFile: typescriptGetPath(minify),
        },
      },
    ],
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
]);
