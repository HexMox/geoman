import debugfactory from 'debug';
import chalk from 'chalk';
import { format } from 'util';

export const debug = debugfactory('goman');

export function error(...args: any) {
  console.error(chalk.red(format.apply(format, args)));
}

export function info(...args: any) {
  console.log(chalk.green(format.apply(format, args)));
}

export function log(...args: any) {
  console.log(chalk.white(format.apply(format, args)));
}
