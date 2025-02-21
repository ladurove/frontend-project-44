import {GameFinishError} from "../builder/GameFinishError.js";
import {MutableQueue} from "../../stdlibs/Queue.js";

export interface GameController<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    isActive: boolean
    questions: AsyncIterator<[QUESTION, (answer: ANSWER) => Promise<RESULT>], GAME_RESULT>
    await(): Promise<GAME_RESULT> // ждет isActive === false
    asFinished(): GAME_RESULT // throw если isActive === true

    _next(question: QUESTION): Promise<[ANSWER, (result: RESULT) => void]>
    finish(gameResult: GAME_RESULT): void
}


export function GameController<QUESTION, ANSWER, RESULT, GAME_RESULT>(): GameController<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    let gameResult: GAME_RESULT | undefined
    let finishGame!: (gameResult: GAME_RESULT) => void
    const finishGamePromise = new Promise<GAME_RESULT>((resolve) => {
        finishGame = (_gameResult) => {
            gameResult = _gameResult
            resolve(_gameResult)
        }
    })
    const questionsQueue = MutableQueue<[QUESTION, (answer: ANSWER) => Promise<RESULT>]>()

    const controller: GameController<QUESTION, ANSWER, RESULT, GAME_RESULT> = {
        isActive: true,
        questions: {
            next: async function (): Promise<IteratorResult<[QUESTION, (answer: ANSWER) => Promise<RESULT>], GAME_RESULT>> {
                if (!controller.isActive)
                    return { done: true, value: gameResult! }
                const result = await questionsQueue.next()
                return { done: false, value: result }
            }
        },
        await: () => finishGamePromise,
        asFinished(): GAME_RESULT {
            if (controller.isActive)
                throw Error('Game not finished!')
            return gameResult!
        },

        _next: async function (question: QUESTION): Promise<[ANSWER, (result: RESULT) => void]> {
            if (!this.isActive)
                throw new GameFinishError()

            let resolveAnswer!: (answer: ANSWER) => void
            const answerPromise = new Promise<ANSWER>((resolve) =>
                resolveAnswer = resolve
            )

            let resolveAnswerResult!: (result: RESULT) => void
            const answerResultPromise = new Promise<RESULT>((resolve) =>
                resolveAnswerResult = resolve
            )

            const q: [QUESTION, (answer: ANSWER) => Promise<RESULT>] = [question, (answer: ANSWER): Promise<RESULT> => {
                resolveAnswer(answer)
                return answerResultPromise
            }]

            questionsQueue.push(q)

            return [await answerPromise, (answerResult) => {
                resolveAnswerResult(answerResult)
            }]
        },
        finish: function (gameResult: GAME_RESULT): void {
            if (!this.isActive)
                throw Error('Already finished')
            this.isActive = false
            finishGame(gameResult)
        }
    }

    return controller
}
