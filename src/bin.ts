#!/usr/bin/env node
import debug from 'debug';
import program from 'commander';
import json from '../package.json';

program
  .version(json.version)
  .option('-d, --debug', 'enable debug logs', true)
  .arguments('<generator> [dirname]')
  .description('generate files by a generator name or config(eg. goman your-template.config.js)')
  .action(async () => {});

if (program.debug) {
  debug.enable('goman:*');
}

program.parse(process.argv);

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});
