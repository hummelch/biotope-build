"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin';
var ExtendedDefinePlugin = require("extended-define-webpack-plugin");
// import * as PrerenderSpaPlugin from 'prerender-spa-plugin';
var mergeDeep = require("merge-deep");
var base_config_1 = require("./base.config");
exports.config = function (options) {
    var _a = base_config_1.baseConfig(options), configuration = _a[0], _b = _a[1], runtime = _b.runtime, overrides = _b.overrides;
    return overrides(mergeDeep({}, configuration, {
        plugins: [
            // new FaviconsWebpackPlugin(favicon.all),
            new ExtendedDefinePlugin(runtime),
        ],
    }), mergeDeep);
};
