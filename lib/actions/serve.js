"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalWebServer = require("local-web-server");
var PORT = 8000;
var serve = function (options) {
    (new LocalWebServer()).listen({
        port: PORT,
        https: options.production,
        compress: options.production,
        directory: options.directory || 'dist',
        spa: options.spa ? 'index.html' : undefined,
    });
    var url = "http" + (options.production ? 's' : '') + "://127.0.0.1:" + PORT;
    // tslint:disable-next-line:no-console
    console.log("Serving files on " + url + " \u2026");
    if (options.open) {
        // tslint:disable-next-line:no-require-imports
        require('opn')(url);
    }
};
exports.registerServe = function (program) { return program
    .command('serve')
    .option('-d, --directory', 'Directory in which to serve')
    .option('-o, --open', 'Open the web-page on the default browser')
    .option('-p, --production', 'Serve with https and gzip')
    .option('-s, --spa', 'Single-page application (must contain an index.html file in root)')
    .action(serve); };
