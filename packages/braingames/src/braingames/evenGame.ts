import {buildGame, type Game} from "game";
import {randomOf} from "stdlibs";


export type Question = {num: number, validAnswer: boolean}
export type Answer = boolean
export type Result = "Valid" | "Fail"
export type GameResult = {validAnswers: number, invalidAnswers: number}

export type EvenGame = Game<Question, Answer, Result, GameResult>

function createQuestion(): Question {
    const num = Math.round(Math.random() * 10)
    const isEven = num % 2 == 0
    return {num, validAnswer: isEven}
}

export const create = (): EvenGame => buildGame<EvenGame>(async (builder) => {
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
