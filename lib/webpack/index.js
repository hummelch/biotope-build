"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environments_1 = require("./environments");
exports.webpackInit = function (environment, options) {
    var actualEnv = environments_1.environments[environment] || environments_1.environments.default;
    process.env.NODE_ENV = actualEnv;
    // tslint:disable-next-line:no-require-imports
    return require("./" + actualEnv + ".config").config(options);
};
