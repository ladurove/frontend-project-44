import { buildGame } from '../game/builder/buildSimpleGame.js';

function createQuestion() {
  const num = Math.round(Math.random() * 10);
  const isEven = num % 2 === 0;
  return { num, validAnswer: isEven };
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
