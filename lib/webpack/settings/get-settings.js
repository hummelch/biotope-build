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
var path_1 = require("path");
var mergeDeep = require("merge-deep");
var prerender_spa_plugin_1 = require("prerender-spa-plugin");
var favicons_1 = require("./favicons");
var paths_1 = require("./paths");
var rules_1 = require("./rules");
var defaultKeywords = ['biotope', 'boilerplate', 'modern', 'framework', 'html5'];
exports.getSettings = function (options) {
    var paths = paths_1.getPaths(options.paths);
    var minify = !!options.minify;
    var webpack = (options.webpack || {});
    var entryPoints = webpack.entryPoints || {
        app: 'index.ts',
    };
    return {
        app: __assign({ title: 'Biotope Boilerplate v7', description: 'Modern HTML5 UI Framework', author: 'Biotope' }, (options.app || {}), { keywords: (((options.app || {}).keywords || defaultKeywords)).join(','), filename: path_1.resolve(paths.distAbsolute + "/index.html"), template: path_1.resolve(paths.baseAbsolute + "/" + (webpack.template || './src/resources/.index.ejs')) }, (minify ? {
            minify: {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                quoteCharacter: '"',
                removeComments: true,
            },
        } : {})),
        environment: options.environment || 'dev',
        minify: minify,
        overrides: options.overrides || (function (s) { return s; }),
        paths: paths,
        runtime: (options.runtime || {})[options.environment || 'dev'] || options.runtime || {},
        webpack: {
            alias: webpack.alias || {},
            cleanExclusions: webpack.cleanExclusions || [],
            disablePlugins: webpack.disablePlugins || [],
            entryPoints: Object.keys(entryPoints).reduce(function (accumulator, key) {
                var _a;
                return (__assign({}, accumulator, (_a = {}, _a[key] = paths.pagesRelative + "/" + entryPoints[key], _a)));
            }, {}),
            externalFiles: (webpack.externalFiles || ['./src/resources'])
                .map(function (files) { return typeof files === 'string' ? path_1.resolve(files) : (__assign({}, files, { from: path_1.resolve(files.from) })); }),
            favicons: favicons_1.getFavicons(options.webpack, minify),
            output: mergeDeep({}, {
                script: '[name].js',
                style: '[name].css',
            }, webpack.output || {}),
            rules: rules_1.getRules(minify, webpack.disablePlugins || []),
            commonChunk: {
                test: /node_modules/,
                name: 'vendor',
                chunks: 'initial',
            },
            rendering: {
                staticDir: paths.distAbsolute,
                routes: (options.webpack || {}).renderRoutes || ['/'],
                server: { port: 8001 },
                renderer: new prerender_spa_plugin_1.PuppeteerRenderer({
                    args: ['–no-sandbox', '–disable-setuid-sandbox'],
                }),
            },
        },
    };
};
