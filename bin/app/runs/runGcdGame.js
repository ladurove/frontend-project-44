import create from '../../braingames/gcdGame.js';
import getUsername from '../getUsername.js';
import runConsoleGame from './runConsoleGame.js';
import WithTermResult from '../../game/modifiers/WithTermResult.js';
import WithMaxIterations from '../../game/modifiers/WithMaxIterations.js';

export default async function runGcdGame() {
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
    stringifyQuestion: (question) => 'Find the greatest common divisor of given numbers.\n'
            + `Question: ${question.a} ${question.b}\n`
            + 'Your answer: ',
    stringifyResult: (result, answer, question) => {
      if (result === 'Valid') { return 'Correct!'; }
      if (result === 'Fail') { return `'${answer}' is wrong answer ;(. Correct answer was '${question.validAnswer}'.`; }
      throw Error(`unreachable result ${result}`);
    },
    stringifyGameResult: (gameResult) => {
      if (gameResult.invalidAnswers === 0) { return `Congratulations, ${username}!`; }
      return `Let's try again, ${username}!`;
    },
  });
}
