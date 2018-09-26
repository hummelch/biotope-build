"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var mini_css_extract_plugin_1 = require("mini-css-extract-plugin");
var projectPath = path_1.resolve(process.cwd());
var biotopeBuildPath = path_1.resolve(projectPath + "/node_modules/@biotope/build");
var babelPath = fs_1.existsSync(projectPath + "/.babelrc.js")
    ? projectPath + "/.babelrc.js"
    : biotopeBuildPath + "/.babelrc.js";
// tslint:disable-next-line:no-require-imports no-var-requires
var babelOptions = require(babelPath);
var postCssPath = fs_1.existsSync(projectPath + "/postcss.config.js")
    ? projectPath + "/"
    : biotopeBuildPath + "/";
exports.getRules = function (minify, disabledPlugins) { return ([
    {
        test: /\.(js|tsx?)$/,
        use: {
            loader: 'babel-loader',
            options: babelOptions,
        },
    },
    {
        test: /\.scss$/,
        use: (disabledPlugins.indexOf('mini-css-extract-plugin') < 0 ? [mini_css_extract_plugin_1.loader] : []).concat([
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
        ]),
    },
]); };
