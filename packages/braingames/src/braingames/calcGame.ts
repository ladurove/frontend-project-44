import {buildGame, type Game} from "game";
import {randomOf} from "stdlibs";

export type Question = {a: number, b: number, operation: '-' | '+' | '*', validAnswer: number}
export type Answer = number
export type Result = "Valid" | "Fail"
export type GameResult = {validAnswers: number, invalidAnswers: number}

export type CalcGame = Game<Question, Answer, Result, GameResult>

function createQuestion(): Question {
    const num1 = Math.round(Math.random() * 10)
    const num2 = Math.round(Math.random() * 10)
    const operation = randomOf(["+", "-", "*"])
    const result = (() => {
        if (operation === '+')
            return num1 + num2
        if (operation === '-')
            return num1 - num2
        if (operation === '*')
            return num1 * num2
        throw Error('unreachable')
    })()

    return {a: num1, b: num2, operation: operation, validAnswer: result}
}

export const create = (): CalcGame => buildGame<CalcGame>(async (builder) => {
    let validAnswers = 0
    let invalidAnswers = 0
    builder.onFinishRequest(async () =>
        ({validAnswers, invalidAnswers})
    )

    while (true) {
        const question = createQuestion()

        const [answer, answerResolve] = await builder.next(question)
        if (answer === question.validAnswer) {
            validAnswers++
            answerResolve("Valid")
        } else {
            invalidAnswers++
            answerResolve("Fail")
        }
    }
})
