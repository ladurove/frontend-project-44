export default function WithTermResult(game, predicate) {
  return {
    ...game,
    questions: {
      async next() {
        const next = await game.questions.next();
        if (next.done === false) {
          const [question, resolveQuestion] = next.value;
          return {
            done: false,
            value: [question, async (answer) => {
              const result = await resolveQuestion(answer);
              if (predicate(result, answer, question)) { await game.requestFinish(); }
              return result;
            }],
          };
        }
        return next;
      },
    },
  };
}
