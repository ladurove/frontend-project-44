import type {Game} from "../backend/Game.js";

export function WithTermResult<QUESTION, ANSWER, RESULT, GAME_RESULT>(
    game: Game<QUESTION, ANSWER, RESULT, GAME_RESULT>,
    predicate: (result: RESULT, answer: ANSWER, question: QUESTION) => boolean,
): Game<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    return {
        ...game,
        questions: {
            next: async function (): Promise<IteratorResult<[QUESTION, (answer: ANSWER) => Promise<RESULT>], GAME_RESULT>> {
                const next = await game.questions.next()
                if (next.done === false) {
                    const [question, resolveQuestion] = next.value
                    return {done: false, value: [question, async (answer) => {
                        const result = await resolveQuestion(answer)
                        if (predicate(result, answer, question))
                            await game.requestFinish()
                        return result
                    }]}
                }
                return next
            }
        }
    }
}
