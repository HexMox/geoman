import { QuestionCollection } from 'inquirer';

const questions: QuestionCollection = [
  {
    type: 'input',
    name: 'name',
    message: "what's name?",
    default: 'test',
  },
];

export = {
  src: 'default',
  questions,
  completeMessage: 'done.',
  autoScript: 'echo "thanks to running test"',
  shims: {
    other: {
      src: 'other',
      questions: [
        {
          type: 'input',
          name: 'other',
          message: "what's other name?",
          default: 'test',
        },
      ],
    },
  },
};
