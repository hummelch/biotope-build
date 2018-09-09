import { Configuration, Rule, Options as WebpackOptions } from 'webpack';
import { Configuration as FaviconsConfiguration, VariantName } from 'favicons-webpack-plugin';
import { Options as HtmlOptions } from 'html-webpack-plugin';
import { Options as PrerenderOptions } from 'prerender-spa-plugin';
import * as mergeDeep from 'merge-deep';

export type ProjectEnvironment = 'default' | 'local' | 'dev' | 'prod';
export type NodeEnvironment = 'local' | 'development' | 'production' | 'test';

export interface CommonChunkOptions extends WebpackOptions.CacheGroupsOptions {
  name: string;
}

export interface ExternalFile {
  from: string;
  to?: string;
  toType?: 'file' | 'dir' | 'template';
  context?: string;
  flatten?: boolean;
  ignore?: string[];
  transform?: (content: string, path: string) => string;
  cache?: boolean | { key: string };
  force?: boolean;
}

export type OverrideFunction = (
  configuration: Configuration,
  merge?: typeof mergeDeep,
) => Configuration;

export interface Options {
  app?: {
    author?: string;
    description?: string;
    keywords?: string[];
    title?: string;
  };
  environment?: ProjectEnvironment;
  minify?: boolean;
  overrides?: OverrideFunction;
  paths?: {
    app?: string;
    buildRelative?: string;
    dist?: string;
    pagesRelative?: string;
  };
  runtime?: IndexObjectAny;
  webpack?: {
    alias?: IndexObject<string>;
    cleanExclusions?: string[];
    disablePlugins?: string[];
    entryPoints?: IndexObject<string>;
    externalFiles?: (string | ExternalFile)[];
    favicons?: {
      additionalVariants?: VariantName[];
      cache?: boolean;
      file?: string;
      output?: string;
    };
    filename?: string;
    output?: {
      script?: string;
      style?: string;
    };
    renderRoutes?: string[];
    rules?: Rule[];
    template?: string;
  };
}

export interface Settings {
  app: {
    author: string;
    description: string;
    filename: string;
    keywords: string;
    minify?: HtmlOptions['minify'];
    template: string;
    title: string;
  };
  environment: ProjectEnvironment;
  minify: boolean;
  overrides: OverrideFunction;
  paths: {
    app: string;
    buildRelative: string;
    dist: string;
    pagesRelative: string;
    appAbsolute: string;
    baseAbsolute: string;
    buildAbsolute: string;
    distAbsolute: string;
  };
  runtime: IndexObjectAny;
  webpack: {
    alias: IndexObject<string>;
    cleanExclusions: string[];
    disablePlugins: string[];
    entryPoints: IndexObject<string>;
    externalFiles: (string | ExternalFile)[];
    favicons: {
      additionalVariants: VariantName[];
      cache: boolean;
      file: string;
      icons: FaviconsConfiguration['icons'];
      output: string;
    };
    output: {
      script: string;
      style: string;
    };
    rules: Rule[];
    commonChunk: CommonChunkOptions;
    rendering: PrerenderOptions;
  };
}

export type WebpackConfig = (options: Options) => Configuration;
