import {buildGame, type Game} from "game";
import {randomOf} from "stdlibs";


function findGcd(num1: number, num2: number): number {
    const max = Math.max(num1, num2)
    let gcd = 1
    for (let _ = 1; _ <= max; _++) {
        if (num1 % _ === 0 && num2 % _ === 0)
            gcd = _
    }
    return gcd
}

export type Question = {a: number, b: number, validAnswer: number}
export type Answer = number
export type Result = "Valid" | "Fail"
export type GameResult = {validAnswers: number, invalidAnswers: number}

export type GdcGame = Game<Question, Answer, Result, GameResult>

function createQuestion(): Question {
    const num1 = Math.ceil(Math.random() * 10)
    const num2 = Math.ceil(Math.random() * 10)
    const correctGcd = findGcd(num1, num2)
    return {a: num1, b: num2, validAnswer: correctGcd}
}

export const create = (): GdcGame => buildGame<GdcGame>(async (builder) => {
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
