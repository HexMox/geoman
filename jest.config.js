const path = require('path');

module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: path.resolve(__dirname, 'tsconfig.test.json'),
      diagnostics: false,
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    // 为了编译@tencnet/下的包
    // '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!@tencent)'],
  testMatch: ['**/*.test.(ts|js)'],
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  setupFiles: ['./jest.setup.js']
};
