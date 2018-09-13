import * as tsconfigBase from '../../tsconfig.base.json';
import { Action } from './types';
import { tsc, compilerCallback, getCompiler, CompileOptions } from './compilation';

const configFiles = [
  '.babelrc.ts',
  'biotope-build.config.ts',
  'postcss.config.ts',
];

const compile = (options: CompileOptions) => {
  tsc(configFiles, tsconfigBase);

  if (!options.watch) {
    getCompiler(options).run(compilerCallback(false));
  } else {
    // tslint:disable-next-line:no-console
    console.log('@biotope/build is watching files…\n');
    getCompiler(options).watch({}, compilerCallback(true));
  }
};

export const registerCompile: Action = program => program
  .command('compile')
  .option('-c, --config <file>', 'An extention configuration file')
  .option('-e, --environment <file>', 'The requested environment')
  .option('-w, --watch', 'Watches files and recompiles them')
  .action(compile);
