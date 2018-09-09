"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsconfigBase = require("../../tsconfig.base.json");
var webpack_1 = require("../webpack");
var compilation_1 = require("./compilation");
var compile = function (options) {
    compilation_1.tsc(['./biotope-build.config.ts', '.babelrc.ts', 'postcss.config.ts'], tsconfigBase);
    if (!options.watch) {
        compilation_1.getCompiler(options, webpack_1.webpackInit).run(compilation_1.compilerCallback);
    }
    else {
        // tslint:disable-next-line:no-console
        console.log('@biotope/build is watching files…\n');
        compilation_1.getCompiler(options, webpack_1.webpackInit).watch({}, compilation_1.compilerCallback);
    }
};
exports.registerCompile = function (program) { return program
    .command('compile')
    .option('-c, --config <file>', 'An extention configuration file')
    .option('-e, --environment <file>', 'The requested environment')
    .option('-w, --watch', 'Watches files and recompiles them')
    .action(compile); };
