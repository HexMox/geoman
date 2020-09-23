import fs from 'fs';
import inquirer from 'inquirer';
import { join } from 'path';
import { generate } from '../../src/index';

// process.cwd() is project root

jest.mock('inquirer');

const answers = {
  name: 'normal',
  other: 'shims',
};

const expected = {
  default: 'This is default txt.\n',
  other: `This is ${answers.other} txt.\n`,
};

const src = 'test/.template';
const dest = 'test/.output';
const result = join(process.cwd(), dest, `${answers.name}.txt`);

describe('geoman:generate', () => {
  test('normally create files', async () => {
    inquirer.prompt = jest.fn().mockResolvedValueOnce(answers) as any;

    await generate(src, dest);

    expect(fs.readFileSync(result, 'utf-8')).toBe(expected.default);
  });

  test('choosing sub-template options', async () => {
    inquirer.prompt = jest.fn().mockResolvedValueOnce(answers) as any;

    await generate(`${src}:other`, dest);

    expect(fs.readFileSync(result, 'utf-8')).toBe(expected.other);
  });

  // test('logging complete message and execute auto script', () => {});
});
