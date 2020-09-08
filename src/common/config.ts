import path from 'path';
import { QuestionCollection } from 'inquirer';
import { debug, error } from './logger';

/**
 * 预留，额外gulp插件配置
 */
export type GomanPluginConfig =
  | string
  | [
      string,
      {
        [k: string]: any;
      },
    ];

export type GomanConfig = TemplateOptions & {
  /**
   * 子模板配置
   */
  shims: {
    [k: string]: GomanConfig;
  };
};

export type TemplateOptions = {
  /**
   * 自身(相对于process.cwd())的路径
   */
  filepath: string;
  /**
   * 模板(相对于meta.js或绝对)路径
   */
  src: string;
  /**
   * 目标(相对于process.cwd())路径
   */
  dest?: string;
  /**
   * inquirer配置交互问题
   */
  questions: QuestionCollection;
  /**
   * 文件过滤，pattern -> 变量名
   */
  filters?: { [k: string]: string }[];
  /**
   * 结束语
   */
  completeMessage?: string;
  /**
   * 结束脚本
   */
  autoScript?: string;
};

/**
 * 读取模板路径配置meta.js
 * @param templateStr 模板路径:模板名称
 */
export async function readGomanConfig(templateStr: string): Promise<GomanConfig> {
  const [templateRelativePath] = splittemplateStr(templateStr);
  const templatePath = path.join(process.cwd(), templateRelativePath);
  const metaPath = path.join(templatePath, 'meta.js');

  try {
    // eslint-disable-next-line
    const options = require(metaPath);

    options.filepath = templateRelativePath;

    return options;
  } catch (e) {
    error('获取meta.js配置失败', e);
    process.exit(1);
  }
}

/**
 * 读取模板名称对应的配置
 * @param templateStr 模板路径:模板名称
 */
export async function readTemplateOptions(templateStr: string): Promise<TemplateOptions> {
  const [, templateName] = splittemplateStr(templateStr);
  const config = await readGomanConfig(templateStr);
  const { shims, ...rest } = config;

  if (templateName && typeof shims[templateName] === 'object') {
    const { questions } = config;
    const { questions: subQuestions, ...others } = shims[templateName];

    debug(`merging sub-template(${templateName}) options`, shims[templateName]);
    return {
      ...rest,
      ...others,
      // @todo QuestionCollection maybe object
      questions: Array.isArray(questions) && Array.isArray(subQuestions) ? [...questions, ...subQuestions] : [],
    };
  }

  return rest;
}

/**
 * 将模板名称劈开，.template:util -> ['.template', 'util']
 * @param templateStr
 */
export function splittemplateStr(templateStr: string) {
  return templateStr.split(':');
}
