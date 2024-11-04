import {Game} from "../game/backend/Game";
import {randomOf} from "../libs";
import {buildGame, buildSimpleGame} from "../game/builder/buildSimpleGame";

export namespace CalcGame {
    export type Question = {a: number, b: number, operation: '-' | '+' | '*', validAnswer: number}
    export type Answer = number
    export type Result = "Valid" | "Fail"
    export type GameResult = "Congratulations" | "Fail"
}

export type CalcGame = Game<CalcGame.Question, CalcGame.Answer, CalcGame.Result, CalcGame.GameResult>

function question(): CalcGame.Question {
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

export const CalcGame = (): CalcGame => buildGame<CalcGame>(async (builder) => {
    const questions = [
        question(),
        question(),
        question(),
        question()
    ]

    for (let i = 1; i < 4; i++) {
        const question = questions[i-1]

        const [answer, answerResolve] = await builder.next(question)
        if (answer === question.validAnswer) {
            answerResolve("Valid")
        } else {
            answerResolve("Fail")
            builder.finish("Fail")
        }
    }

    return "Congratulations"
})
