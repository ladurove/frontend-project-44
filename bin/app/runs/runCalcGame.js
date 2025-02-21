import getUsername from '../getUsername.js';
import runConsoleGame from './runConsoleGame.js';
import WithTermResult from '../../game/modifiers/WithTermResult.js';
import WithMaxIterations from '../../game/modifiers/WithMaxIterations.js';
import create from '../../braingames/calcGame.js';

export default async function runCalcGame() {
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
    stringifyQuestion: (question) => 'What is the result of the expression?\n'
            + `Question: ${question.a} ${question.operation} ${question.b}\n`
            + 'Your answer: ',
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
