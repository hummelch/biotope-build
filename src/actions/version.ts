import { Command } from 'commander';

import { version } from '../../package.json';

export const registerVersion = (program: Command): Command => program.version(version as string);
