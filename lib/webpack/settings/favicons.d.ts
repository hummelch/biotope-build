/// <reference types="webpack" />
import { VariantName } from 'favicons-webpack-plugin';
export declare const getFavicons: (webpack: {
    alias?: IndexObject<string> | undefined;
    chunks?: import("webpack").Options.CacheGroupsOptions[] | undefined;
    cleanExclusions?: string[] | undefined;
    compileExclusions?: string[] | undefined;
    disablePlugins?: string[] | undefined;
    entryPoints?: IndexObject<string | import("./types").EntryPointOption> | undefined;
    extensions?: string[] | undefined;
    externalFiles?: (string | import("./types").ExternalFile)[] | undefined;
    favicons?: {
        additionalVariants?: VariantName[] | undefined;
        cache?: boolean | undefined;
        output?: string | undefined;
    } | undefined;
    output?: {
        script?: string | undefined;
        style?: string | undefined;
    } | undefined;
    renderRoutes?: string[] | undefined;
    rules?: import("webpack").RuleSetRule[] | undefined;
} | undefined, paths: {
    app: string;
    assetsRelative: string;
    pagesRelative: string;
    dist: string;
    buildRelative: string;
    server: string;
    baseAbsolute: string;
    appAbsolute: string;
    pagesAbsolute: string;
    assetsAbsolute: string;
    buildAbsolute: string;
    distAbsolute: string;
}, minify: boolean) => {
    additionalVariants: VariantName[];
    cache: boolean;
    file: string;
    icons: {
        android?: boolean | undefined;
        appleIcon?: boolean | undefined;
        appleStartup?: boolean | undefined;
        coast?: boolean | undefined;
        favicons: boolean;
        firefox?: boolean | undefined;
        opengraph?: boolean | undefined;
        twitter?: boolean | undefined;
        yandex?: boolean | undefined;
        windows?: boolean | undefined;
    };
    output: string;
};
