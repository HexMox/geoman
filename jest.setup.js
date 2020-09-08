const shell = require('shelljs');

shell.exec('tsc ./test/.template/meta.ts', { silent: true });
