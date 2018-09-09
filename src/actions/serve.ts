import { Command } from 'commander';
import * as LocalWebServer from 'local-web-server';

const PORT = 8000;

interface ServeOptions {
  directory?: string;
  open?: boolean;
  production?: boolean;
  spa?: boolean;
}

const serve = (options: ServeOptions) => {
  (new LocalWebServer()).listen({
    port: PORT,
    https: options.production,
    compress: options.production,
    directory: options.directory || 'dist',
    spa: options.spa ? 'index.html' : undefined,
  });

  const url = `http${options.production ? 's' : ''}://127.0.0.1:${PORT}`;
  // tslint:disable-next-line:no-console
  console.log(`Serving files on ${url} …`);

  if (options.open) {
    // tslint:disable-next-line:no-require-imports
    require('opn')(url);
  }
};

export const registerServe = (program: Command): Command => program
  .command('serve')
  .option('-d, --directory', 'Directory in which to serve')
  .option('-o, --open', 'Open the web-page on the default browser')
  .option('-p, --production', 'Serve with https and gzip')
  .option('-s, --spa', 'Single-page application (must contain an index.html file in root)')
  .action(serve);
