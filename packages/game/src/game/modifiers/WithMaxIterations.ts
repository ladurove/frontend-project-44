import type {Game} from "../backend/Game.js";


export function WithMaxIterations<QUESTION, ANSWER, RESULT, GAME_RESULT>(
    game: Game<QUESTION, ANSWER, RESULT, GAME_RESULT>,
    iterations: number
): Game<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    let iteration = 0
    return {
        ...game,
        questions: {
            next: async function (): Promise<IteratorResult<[QUESTION, (answer: ANSWER) => Promise<RESULT>], GAME_RESULT>> {
                iteration++
                if (iteration > iterations)
                    return { done: true, value: await game.requestFinish()}
                return await game.questions.next()
            }
        }
    }
}
