import { Configuration } from 'webpack';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import * as ManifestJsonWebpackPlugin from 'manifest-json-webpack-plugin';

import { Options, Settings, getSettings } from './settings';

export const baseConfig = (options: Options): [Configuration, Settings] => {
  const settings = getSettings(options);

  return [{
    context: settings.paths.appAbsolute,
    devtool: 'cheap-module-source-map',
    mode: 'development',
    entry: settings.webpack.entryPoints,
    module: { rules: settings.webpack.rules },
    output: {
      path: settings.paths.buildAbsolute,
      filename: settings.webpack.output.script,
      publicPath: `/${settings.paths.buildRelative}`,
    },
    optimization: {
      minimize: false,
      ...(settings.webpack.commonChunk && settings.webpack.commonChunk.name ? {
        runtimeChunk: { name: settings.webpack.commonChunk.name },
        splitChunks: {
          cacheGroups: { commons: settings.webpack.commonChunk },
        },
      } : {}),
    },
    plugins: [
      new CleanWebpackPlugin(settings.paths.dist, {
        root: settings.paths.baseAbsolute,
        exclude: settings.webpack.cleanExclusions || [],
        verbose: false,
      }),
      new CopyWebpackPlugin(settings.webpack.externalFiles.map((filesRules) => {
        const parsedRules = typeof filesRules === 'string' ? { from: filesRules } : filesRules;
        return {
          ...parsedRules,
          to: `${settings.paths.distAbsolute}/${parsedRules.to || ''}`,
          ignore: parsedRules.ignore || ['.*'],
        };
      })),
      new MiniCssExtractPlugin({ filename: settings.webpack.output.style }),
      new HtmlWebpackPlugin(settings.app),
      new FaviconsWebpackPlugin({
        title: settings.app.title,
        logo: settings.webpack.favicons.file,
        prefix: `${settings.webpack.favicons.output}/`,
        persistentCache: settings.webpack.favicons.cache,
        icons: settings.webpack.favicons.icons,
      }),
      new ManifestJsonWebpackPlugin({
        path: settings.paths.pagesRelative.split('/').filter(f => !!f).reduce(() => `../`, ''),
        pretty: settings.minify,
        name: settings.app.title,
        description: settings.app.description,
        lang: 'en',
        icons: settings.webpack.favicons.output,
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.scss'],
      alias: settings.webpack.alias,
      modules: [
        settings.paths.appAbsolute,
        'node_modules',
      ],
    },
  }, settings];
};
