import type {Game} from "../game/backend/Game.js";
import {buildGame} from "../game/builder/buildSimpleGame.js";

export type Question = {before: number[], after: number[], validAnswer: number}
export type Answer = number
export type Result = "Valid" | "Fail"
export type GameResult = {validAnswers: number, invalidAnswers: number}

export type ProgressionGame = Game<Question, Answer, Result, GameResult>

function createProgression(length: number = 10): Question {
    if (length < 2) throw Error('length must be >= 2')
    const num = Math.max(1, Math.round(Math.random() * 10))
    const startNum = Math.round(Math.random() * 20)
    const nums = (() => {
        const nums: number[] = [startNum]
        for (let i = 0; i < length - 1; i++) {
            nums.push(nums[i] + num)
        }
        return nums
    })()
    const [before, after, validAnswer] = (() => {
        const gap = Math.round(Math.random() * length)
        const before = nums.slice(0, gap)
        const after = nums.slice(gap, nums.length)
        const validAnswer = before.pop() ?? after.shift()!
        return [before, after, validAnswer]
    })()

    return {before, after, validAnswer}
}

export const create = (): ProgressionGame => buildGame<ProgressionGame>(async (builder) => {
    let validAnswers = 0
    let invalidAnswers = 0
    builder.onFinishRequest(async () =>
        ({validAnswers, invalidAnswers})
    )

    while (true) {
        const question = createProgression()

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
