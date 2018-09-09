"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CleanWebpackPlugin = require("clean-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var FaviconsWebpackPlugin = require("favicons-webpack-plugin");
var ManifestJsonWebpackPlugin = require("manifest-json-webpack-plugin");
var settings_1 = require("./settings");
exports.baseConfig = function (options) {
    var settings = settings_1.getSettings(options);
    return [{
            context: settings.paths.appAbsolute,
            devtool: 'cheap-module-source-map',
            mode: 'development',
            entry: settings.webpack.entryPoints,
            module: { rules: settings.webpack.rules },
            output: {
                path: settings.paths.buildAbsolute,
                filename: settings.webpack.output.script,
                publicPath: "/" + settings.paths.buildRelative,
            },
            optimization: __assign({ minimize: false }, (settings.webpack.commonChunk && settings.webpack.commonChunk.name ? {
                runtimeChunk: { name: settings.webpack.commonChunk.name },
                splitChunks: {
                    cacheGroups: { commons: settings.webpack.commonChunk },
                },
            } : {})),
            plugins: [
                new CleanWebpackPlugin(settings.paths.dist, {
                    root: settings.paths.baseAbsolute,
                    exclude: settings.webpack.cleanExclusions || [],
                    verbose: false,
                }),
                new CopyWebpackPlugin(settings.webpack.externalFiles.map(function (filesRules) {
                    var parsedRules = typeof filesRules === 'string' ? { from: filesRules } : filesRules;
                    return __assign({}, parsedRules, { to: settings.paths.distAbsolute + "/" + (parsedRules.to || ''), ignore: parsedRules.ignore || ['.*'] });
                })),
                new MiniCssExtractPlugin({ filename: settings.webpack.output.style }),
                new HtmlWebpackPlugin(settings.app),
                new FaviconsWebpackPlugin({
                    title: settings.app.title,
                    logo: settings.webpack.favicons.file,
                    prefix: settings.webpack.favicons.output + "/",
                    persistentCache: settings.webpack.favicons.cache,
                    icons: settings.webpack.favicons.icons,
                }),
                new ManifestJsonWebpackPlugin({
                    path: settings.paths.pagesRelative.split('/').filter(function (f) { return !!f; }).reduce(function () { return "../"; }, ''),
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
