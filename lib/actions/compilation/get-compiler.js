"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack = require("webpack");
var get_config_1 = require("./get-config");
var ENVIRONMENT_DEFAULT = 'dev';
exports.getCompiler = function (_a, webpackInit) {
    var config = _a.config, environment = _a.environment;
    var compiler = webpack(webpackInit(environment || ENVIRONMENT_DEFAULT, get_config_1.getConfig(config)));
    (new webpack.ProgressPlugin()).apply(compiler);
    return compiler;
};
