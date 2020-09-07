#!/usr/bin/env node
import debug from 'debug';
import program from 'commander';
import { generate } from './index';
import { error } from './common/logger';
import json from '../package.json';

program
  .version(json.version)
  .option('-d, --debug', 'enable debug logs', true)
  .arguments('<template> [dest]')
  .description('generate files by template folder(eg. goman .template:util)')
  .action(async (template: string, dest?: string) => {
    await generate(template, dest);
  });

if (program.debug) {
  debug.enable('goman*');
}

program.parse(process.argv);

process.on('unhandledRejection', (e) => {
  error(e);
  process.exit(1);
});
