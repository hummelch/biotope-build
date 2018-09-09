"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var runner_1 = require("tslint/lib/runner");
var projectPath = path_1.resolve(process.cwd());
var biotopeBuildPath = path_1.resolve(projectPath + "/node_modules/@biotope/build");
var lintFile = fs_1.existsSync(projectPath + "/tslint.json")
    ? projectPath + "/tslint.json"
    : biotopeBuildPath + "/tslint.json";
var typescriptExistsBaseConfig = fs_1.existsSync(projectPath + "/tsconfig.json");
var typescriptExistsProdConfig = fs_1.existsSync(projectPath + "/tsconfig.prod.json");
var typescriptGetPath = function (minify) {
    if (!minify) {
        return typescriptExistsBaseConfig
            ? projectPath + "/tsconfig.json"
            : biotopeBuildPath + "/tsconfig.base.json";
    }
    if (typescriptExistsProdConfig) {
        return projectPath + "/tsconfig.prod.json";
    }
    if (typescriptExistsBaseConfig) {
        return biotopeBuildPath + "/tsconfig.prod.external.json";
    }
    return biotopeBuildPath + "/tsconfig.prod.json";
};
var lint = function (options) {
    if (options.typescript) {
        runner_1.run({
            config: lintFile,
            project: typescriptGetPath(false),
            files: ['**/*.ts'],
            exclude: ['**/node_modules/**'],
            fix: !!options.fix,
            format: 'verbose',
        }, console)
            .then(function (value) {
            process.exit(value);
        })
            .catch(function (error) { return console.error(error); });
    }
    if (options.javascript) {
        console.error('Not implemented yet…');
    }
    if (options.sass) {
        console.error('Not implemented yet…');
    }
};
exports.registerLint = function (program) { return program
    .command('lint')
    .option('-t, --typescript', 'Lint typescript (*.ts) files')
    .option('-j, --javascript', 'Lint javascript (*.js) files')
    .option('-s, --sass', 'Lint sass (*.scss) files')
    .option('-f, --fix', 'Try to fix any erros found')
    .action(lint); };
