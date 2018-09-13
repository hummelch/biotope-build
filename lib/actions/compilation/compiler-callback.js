"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serve_1 = require("./serve");
var firstTimeFinish = true;
exports.compilerCallback = function (watch) { return function (error, stats) {
    if (firstTimeFinish && watch) {
        firstTimeFinish = false;
        serve_1.serve({ open: true });
    }
    if (error) {
        // tslint:disable-next-line:no-console
        console.error(error.stack || error);
        if (error.details) {
            // tslint:disable-next-line:no-console
            console.error(error.details);
        }
        process.exit(1);
    }
    if (stats.compilation) {
        if (stats.compilation.errors.length !== 0) {
            stats.compilation.errors.forEach(function (compilationError) { return console.error(compilationError.message); });
            process.exitCode = 2;
        }
        else {
            // tslint:disable-next-line:no-console
            console.log(stats.toString({
                colors: true,
                cached: false,
                cachedAssets: false,
            }));
        }
    }
}; };
