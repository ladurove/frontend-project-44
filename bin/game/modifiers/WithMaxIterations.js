export default function WithMaxIterations(game, iterations) {
  let iteration = 0;
  return {
    ...game,
    questions: {
      async next() {
        iteration += 1;
        if (iteration > iterations) { return { done: true, value: await game.requestFinish() }; }
        return game.questions.next();
      },
    },
  };
}
