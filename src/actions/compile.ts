import { Command } from 'commander';

import * as tsconfigBase from '../../tsconfig.base.json';
import { webpackInit } from '../webpack';
import { tsc, compilerCallback, getCompiler, CompileOptions } from './compilation';

const compile = (options: CompileOptions) => {
  tsc(['./biotope-build.config.ts', '.babelrc.ts', 'postcss.config.ts'], tsconfigBase);

  if (!options.watch) {
    getCompiler(options, webpackInit).run(compilerCallback);
  } else {
    // tslint:disable-next-line:no-console
    console.log('@biotope/build is watching files…\n');
    getCompiler(options, webpackInit).watch({}, compilerCallback);
  }
};

export const registerCompile = (program: Command): Command => program
  .command('compile')
  .option('-c, --config <file>', 'An extention configuration file')
  .option('-e, --environment <file>', 'The requested environment')
  .option('-w, --watch', 'Watches files and recompiles them')
  .action(compile);
