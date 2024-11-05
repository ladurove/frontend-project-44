import {randomOf, readln} from "../../libs/libs.js";
import type {Game} from "../../libs/game/backend/Game.js";
import {buildGame} from "../../libs/game/builder/buildSimpleGame.js";


export namespace EvenGame {
    export type Question = {num: number, validAnswer: boolean}
    export type Answer = boolean
    export type Result = "Valid" | "Fail"
    export type GameResult = {validAnswers: number, invalidAnswers: number}
}

export type EvenGame = Game<EvenGame.Question, EvenGame.Answer, EvenGame.Result, EvenGame.GameResult>

function createQuestion(): EvenGame.Question {
    const num = Math.round(Math.random() * 10)
    const isEven = num % 2 == 0
    return {num, validAnswer: isEven}
}

export const EvenGame = (): EvenGame => buildGame<EvenGame>(async (builder) => {
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
