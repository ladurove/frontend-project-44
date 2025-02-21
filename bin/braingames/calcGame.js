import { randomOf } from '../stdlibs/libs.js';
import { buildGame } from '../game/builder/buildSimpleGame.js';

function createQuestion() {
  const num1 = Math.round(Math.random() * 10);
  const num2 = Math.round(Math.random() * 10);
  const operation = randomOf(['+', '-', '*']);
  const result = (() => {
    if (operation === '+') { return num1 + num2; }
    if (operation === '-') { return num1 - num2; }
    if (operation === '*') { return num1 * num2; }
    throw Error('unreachable');
  })();

  return {
    a: num1, b: num2, operation, validAnswer: result,
  };
}

export default function create() {
  return buildGame(async (builder) => {
    let validAnswers = 0;
    let invalidAnswers = 0;
    builder.onFinishRequest(async () => ({ validAnswers, invalidAnswers }));

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const question = createQuestion();

      // eslint-disable-next-line no-await-in-loop
      const [answer, answerResolve] = await builder.next(question);
      if (answer === question.validAnswer) {
        validAnswers += 1;
        answerResolve('Valid');
      } else {
        invalidAnswers += 1;
        answerResolve('Fail');
      }
    }
  });
}
