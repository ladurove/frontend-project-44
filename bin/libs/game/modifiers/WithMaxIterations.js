/* eslint-disable */
export function WithMaxIterations(game, iterations) {
    let iteration = 0;
    return {
        ...game,
        questions: {
            next: async function () {
                iteration++;
                if (iteration > iterations)
                    return { done: true, value: await game.requestFinish() };
                return await game.questions.next();
            }
        }
    };
}
