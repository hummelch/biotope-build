import { Stats } from 'webpack';

import { serve } from './serve';

interface WebpackCompileError extends Error {
  // tslint:disable-next-line:no-any
  details?: any;
}

let firstTimeFinish = true;

export const compilerCallback = (watch: boolean) => (error: WebpackCompileError, stats: Stats) => {
  if (firstTimeFinish && watch) {
    firstTimeFinish = false;
    serve({ open: true });
  }

  if (error) {
    // tslint:disable-next-line:no-console
    console.error(error.stack || error);
    if (error.details) {
      // tslint:disable-next-line:no-console
      console.error(error.details);
    }
    process.exit(1);
  }
  if (stats.compilation) {
    if (stats.compilation.errors.length !== 0) {
      // tslint:disable-next-line:no-console
      stats.compilation.errors.forEach(compilationError => console.error(compilationError.message));
      process.exitCode = 2;
    } else {
      // tslint:disable-next-line:no-console
      console.log(stats.toString({
        colors: true,
        cached: false,
        cachedAssets: false,
      }));
    }
  }
};
