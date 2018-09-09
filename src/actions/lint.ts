import { existsSync } from 'fs';
import { resolve } from 'path';
import { Command } from 'commander';
import { run } from 'tslint/lib/runner';

const projectPath = resolve(process.cwd());
const biotopeBuildPath = resolve(`${projectPath}/node_modules/@biotope/build`);

const lintFile = existsSync(`${projectPath}/tslint.json`)
  ? `${projectPath}/tslint.json`
  : `${biotopeBuildPath}/tslint.json`;

const typescriptExistsBaseConfig = existsSync(`${projectPath}/tsconfig.json`);
const typescriptExistsProdConfig = existsSync(`${projectPath}/tsconfig.prod.json`);
const typescriptGetPath = (minify: boolean): string => {
  if (!minify) {
    return typescriptExistsBaseConfig
      ? `${projectPath}/tsconfig.json`
      : `${biotopeBuildPath}/tsconfig.base.json`;
  }
  if (typescriptExistsProdConfig) {
    return `${projectPath}/tsconfig.prod.json`;
  }
  if (typescriptExistsBaseConfig) {
    return `${biotopeBuildPath}/tsconfig.prod.external.json`;
  }
  return `${biotopeBuildPath}/tsconfig.prod.json`;
};

interface LintOptions {
  typescript?: boolean;
  javascript?: boolean;
  sass?: boolean;
  fix?: boolean;
}

const lint = (options: LintOptions) => {
  if (options.typescript) {
    run({
      config: lintFile,
      project: typescriptGetPath(false),
      files: ['**/*.ts'],
      exclude: ['**/node_modules/**'],
      fix: !!options.fix,
      format: 'verbose',
    }, console)
      .then((value) => {
        process.exit(value);
      })
      // tslint:disable-next-line:no-console
      .catch((error: Error) => console.error(error));
  }
  if (options.javascript) {
    // tslint:disable-next-line:no-console
    console.error('Not implemented yet…');
  }
  if (options.sass) {
    // tslint:disable-next-line:no-console
    console.error('Not implemented yet…');
  }
};

export const registerLint = (program: Command): Command => program
  .command('lint')
  .option('-t, --typescript', 'Lint typescript (*.ts) files')
  .option('-j, --javascript', 'Lint javascript (*.js) files')
  .option('-s, --sass', 'Lint sass (*.scss) files')
  .option('-f, --fix', 'Try to fix any erros found')
  .action(lint);
