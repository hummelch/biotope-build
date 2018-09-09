import { Stats } from 'webpack';

interface WebpackCompileError extends Error {
  // tslint:disable-next-line:no-any
  details?: any;
}

export const compilerCallback = (error: WebpackCompileError, stats: Stats) => {
  if (error) {
    // tslint:disable-next-line:no-console
    console.error(error.stack || error);
    if (error.details) {
      // tslint:disable-next-line:no-console
      console.error(error.details);
    }
    process.exit(1);
  }
  if (stats.compilation && stats.compilation.errors.length !== 0) {
    // tslint:disable-next-line:no-console
    console.error(stats.compilation.errors);
    process.exitCode = 2;
  }
};
