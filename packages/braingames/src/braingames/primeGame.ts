import {buildGame, type Game} from "game";
import {randomOf} from "stdlibs";


export type Question = {num: number, validAnswer: boolean}
export type Answer = boolean
export type Result = "Valid" | "Fail"
export type GameResult = {validAnswers: number, invalidAnswers: number}

export type PrimeGame = Game<Question, Answer, Result, GameResult>

function isPrime(num: number) {
    for(let i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false
    return num > 1
}

function createQuestion(): Question {
    const num = Math.round(Math.random() * 10)
    return {num, validAnswer: isPrime(num)}
}

export const create = (): PrimeGame => buildGame<PrimeGame>(async (builder) => {
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
