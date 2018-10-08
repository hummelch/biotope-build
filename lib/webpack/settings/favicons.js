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
var allVariants = [
    'android',
    'appleIcon',
    'appleStartup',
    'coast',
    'firefox',
    'opengraph',
    'twitter',
    'yandex',
    'windows',
];
var listToVariants = function (variants, defaultValue) { return variants
    .reduce(function (collection, variant) {
    var _a;
    return (__assign({}, collection, (_a = {}, _a[variant] = defaultValue, _a)));
}, {}); };
exports.getFavicons = function (webpack, paths, minify) {
    if (webpack === void 0) { webpack = {}; }
    return ({
        additionalVariants: (webpack.favicons || {}).additionalVariants || [],
        cache: (webpack.favicons || {}).cache || false,
        file: paths.assetsAbsolute + "/favicon.png",
        icons: __assign({ favicons: true }, listToVariants(allVariants, false), listToVariants(((webpack.favicons || {}).additionalVariants || []).concat((minify ? allVariants : [])), true)),
        output: (webpack.favicons || {}).output || 'favicon',
    });
};