import { buildGame } from '../game/builder/buildSimpleGame.js';

function createProgression(length = 10) {
  if (length < 2) throw Error('length must be >= 2');
  const num = Math.max(1, Math.round(Math.random() * 10));
  const startNum = Math.round(Math.random() * 20);
  const nums = (() => {
    const newNums = [startNum];
    for (let i = 0; i < length - 1; i += 1) {
      newNums.push(newNums[i] + num);
    }
    return newNums;
  })();
  const [before, after, validAnswer] = (() => {
    const gap = Math.round(Math.random() * length);
    const newBefore = nums.slice(0, gap);
    const newAfter = nums.slice(gap, nums.length);
    const newValidAnswer = newBefore.pop() ?? newAfter.shift();
    return [newBefore, newAfter, newValidAnswer];
  })();

  return { before, after, validAnswer };
}

export default function create() {
  return buildGame(async (builder) => {
    let validAnswers = 0;
    let invalidAnswers = 0;
    builder.onFinishRequest(async () => ({ validAnswers, invalidAnswers }));

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const question = createProgression();

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
