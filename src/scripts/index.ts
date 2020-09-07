import * as _ from 'lodash';
import { join } from 'path';
import gulp from 'gulp';
import rename from 'gulp-rename';
import template from 'gulp-template';
import inquirer, { QuestionCollection, Answers } from 'inquirer';
import shell from 'shelljs';
import { debug, error, info } from '../common/logger';
import { readTemplateOptions, TemplateOptions } from '../common/config';

const interpolate = /{{([\s\S]+?)}}/g;
const templatify = (s?: string, opts?: _.TemplateOptions) =>
  typeof s === 'string'
    ? _.template(s, {
        ...opts,
        interpolate,
      })
    : () => s;

/**
 * 根据模板生成文件
 * @param templateName 模板路径，如.template:util
 * @param destName 目的路径
 */
export async function generate(templateName: string, destName?: string) {
  const options = await readTemplateOptions(templateName);
  const { questions } = options;

  let answers: Answers;

  gulp.series(
    async () => {
      answers = await prompts(questions);
    },
    () => emit(options, answers, destName),
    () => success(options),
  )((e) => {
    if (e instanceof Error) {
      error(e);
      process.exit(1);
    }

    process.exit(0);
  });
}

/**
 * 收集问题输入
 */
export async function prompts(questions: QuestionCollection) {
  debug('The questions are ', questions);

  return inquirer.prompt(questions).then((answers) => {
    debug('The answers are ', answers);

    return answers;
  });
}

/**
 * 生成文件
 */
export function emit({ filepath, src: srcPath, dest: destPath }: TemplateOptions, answers: Answers, destName?: string) {
  if (!destName ?? destPath) {
    throw new Error('destination must be specified');
  }
  const src = join(process.cwd(), filepath, srcPath, '*.txt');
  const dest = join(process.cwd(), destName ?? destPath ?? '');

  debug('The template src is ', src);
  debug('The destination is ', dest);

  return gulp
    .src(`${src}`)
    .pipe(
      rename((path) => {
        path.dirname = templatify(path.dirname)(answers);
        path.basename = templatify(path.basename)(answers);
        path.extname = templatify(path.extname)(answers);
        debug('Rename template file: ', path);
      }),
    )
    .pipe(template(answers, { interpolate }))
    .pipe(gulp.dest(dest));
}

/**
 * 成功处理
 */
export async function success({ completeMessage, autoScript }: TemplateOptions) {
  if (completeMessage) {
    info(completeMessage);
  }

  if (autoScript) {
    debug('Executing post script: ', autoScript);
    shell.exec(autoScript);
  }
}
