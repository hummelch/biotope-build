"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var dotenv_1 = require("dotenv");
exports.getDotEnv = function (paths) {
    try {
        return dotenv_1.parse(fs_1.readFileSync(path_1.resolve(paths.baseAbsolute + "/.env")));
    }
    catch (_) {
        return {};
    }
};
