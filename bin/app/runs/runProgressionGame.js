import getUsername from '../getUsername.js';
import runConsoleGame from './runConsoleGame.js';
import WithTermResult from '../../game/modifiers/WithTermResult.js';
import WithMaxIterations from '../../game/modifiers/WithMaxIterations.js';
import create from '../../braingames/progressionGame.js';

export default async function runProgressionGame() {
  const username = await getUsername();
  const game = WithTermResult(
    WithMaxIterations(
      create(),
      3,
    ),
    (result) => result === 'Fail',
  );

  console.log(`Hello, ${username}!`);
  await runConsoleGame(game, {
    deserializeAnswer: (string) => ({
      type: 'Ok', answer: parseInt(string, 10),
    }),
    stringifyQuestion: (question) => `What number is missing in the progression?\n${
      (() => {
        const str = [];

        str.push('Question:');
        // stackoverflow.com/questions/55844608/stuck-with-eslint-error-i-e-separately
        // -loops-should-be-avoided-in-favor-of-arra
        // eslint-disable-next-line no-restricted-syntax
        for (const b of question.before) {
          str.push(` ${b}`);
        }
        str.push(' ..');
        // stackoverflow.com/questions/55844608/stuck-with-eslint-error-i-e-separately
        // -loops-should-be-avoided-in-favor-of-arra
        // eslint-disable-next-line no-restricted-syntax
        for (const a of question.after) {
          str.push(` ${a}`);
        }

        str.push('\n');
        return str.join('');
      })()
    }Your answer: `,
    stringifyResult: (result, answer, question) => {
      if (result === 'Valid') { return 'Correct!'; }
      if (result === 'Fail') { return `'${answer}' is wrong answer ;(. Correct answer was '${question.validAnswer}'.`; }
      throw Error(`unreachable result ${result}`);
    },
    stringifyGameResult: (gameResult) => {
      if (gameResult.invalidAnswers === 0) { return `Congratulations, ${username}!`; }
      // else if (gameResult.validAnswers > gameResult.invalidAnswers)
      //     return `Good, ${username}!`
      return `Let's try again, ${username}!`;
    },
  });
}
