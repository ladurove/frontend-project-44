import {getUsername} from "./getUsername";
import {runEvenGame} from "./games/evenGame";
import {runGcdGame} from "./games/gcdGame";
import {randomOf, readln} from "./libs";


// const username = await getUsername()
// await runCalcGame(username)
// await runEvenGame(username)
// await runGcdGame(username)



interface GameController<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    next(question: QUESTION): Promise<[ANSWER, (result: RESULT) => void]>
    finish(gameResult: GAME_RESULT): void
}

interface Game<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    isActive: boolean
    next(): Promise<null | [QUESTION, (answer: ANSWER) => Promise<RESULT>]> // null если игра окончена
    await(): Promise<GAME_RESULT> // ждет isActive === false
}

function runGame<QUESTION, ANSWER, RESULT, GAME_RESULT>(
    iter: (controller: GameController<QUESTION, ANSWER, RESULT, GAME_RESULT>) => Promise<void>
): Game<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    let finishGame!: (gameResult: GAME_RESULT) => void
    const finishGamePromise = new Promise<GAME_RESULT>((resolve) =>
        finishGame = resolve
    )

    let nextQuestion: [QUESTION, (answer: ANSWER) => Promise<RESULT>] | null = null // todo переделать на очередь

    const game: Game<QUESTION, ANSWER, RESULT, GAME_RESULT> = {
        isActive: true,
        await(): Promise<GAME_RESULT> {
            return finishGamePromise
        },
        async next(): Promise<null | [QUESTION, (answer: ANSWER) => Promise<RESULT>]> {
            while (true) {
                await new Promise((it) => setTimeout(it, 10))
                if (!this.isActive)
                    return null
                if (nextQuestion !== null) {
                    const result = nextQuestion
                    nextQuestion = null
                    return result
                }
            }
        }
    }

    const controller: GameController<QUESTION, ANSWER, RESULT, GAME_RESULT> = {
        next: async function (question: QUESTION): Promise<[ANSWER, (result: RESULT) => void]> {
            let resolveAnswer!: (answer: ANSWER) => void
            const answerPromise = new Promise<ANSWER>((resolve) =>
                resolveAnswer = resolve
            )

            let resolveAnswerResult!: (result: RESULT) => void
            const answerResultPromise = new Promise<RESULT>((resolve) =>
                resolveAnswerResult = resolve
            )

            nextQuestion = [question, (answer: ANSWER): Promise<RESULT> => {
                resolveAnswer(answer)
                return answerResultPromise
            }]

            return [await answerPromise, (answerResult) => {
                resolveAnswerResult(answerResult)
            }]
        },
        finish: function (gameResult: GAME_RESULT): void {
            game.isActive = false
            finishGame(gameResult)
        }
    }

    iter(controller).then(() => {
        if (game.isActive)
            throw Error("Необходжимо вызвать controller.finish с результатом игры!")
    })

    return game
}



function createCalcGame() {
    return runGame<
        {a: number, b: number, operation: '-' | '+' | '*', validAnswer: number},
        number,
        "Valid" | "Fail", // валид, невалд игра продолжается, фейл игра остановлена
        "Congratulations" | "Fail"
    >(async (controller) => {
        const operations: ('+' | '-' | '*')[] = ["+", "-", "*"]

        for (let iteration = 1; iteration < 4; iteration++) {
            const num1 = Math.round(Math.random() * 10)
            const num2 = Math.round(Math.random() * 10)
            const operation = randomOf(operations)
            const result = (() => {
                if (operation === '+')
                    return num1 + num2
                if (operation === '-')
                    return num1 - num2
                if (operation === '*')
                    return num1 * num2
                throw Error('unreachable')
            })()
            const [answer, answerResolve] = await controller.next({a: num1, b: num2, operation: operation, validAnswer: result})
            if (result === answer) {
                answerResolve("Valid")
            } else {
                answerResolve("Fail")
                controller.finish("Fail")
                return
            }
        }

        controller.finish("Congratulations")
    })
}

async function runCalcGame(
    username: string
) {
    const game = createCalcGame()

    console.log(`Hello, ${username}!`)
    while (true) {
        const next = await game.next()
        if (next === null) break
        const [question, resolveQuestion] = next

        console.log(`What is the result of the expression?`)
        console.log(`Question: ${question.a} ${question.operation} ${question.b}`)
        const answer = await readln("Your answer: ")

        const result = await resolveQuestion(parseInt(answer))

        if (result === 'Valid') {
            console.log("Correct!")
        // } else if (result === 'Invalid') {
        //     console.log(`'${answer}' is wrong answer ;(. Correct answer was '${question.validAnswer}'.`)
        } else if (result === 'Fail') {
            console.log(`'${answer}' is wrong answer ;(. Correct answer was '${question.validAnswer}'.`)
            console.log(`GAME OVER; Let's try again, ${username}!`)
        }
    }
}

await runCalcGame(await getUsername())
console.log("end")
