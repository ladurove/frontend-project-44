import { PrimeGame } from "braingames";
import {getUsername} from "../getUsername.js";
import {runConsoleGame} from "./runConsoleGame.js";
import {WithMaxIterations, WithTermResult} from "game";


export async function runPrimeGame() {
    const username = await getUsername()
    const game = WithTermResult(
        WithMaxIterations(
            PrimeGame.create(),
            3
        ),
        (result) => result === 'Fail'
    )

    console.log(`Hello, ${username}!`)
    await runConsoleGame(game, {
        deserializeAnswer: (string) => {
            if (string === 'yes' || string === 'y')
                return { type: 'Ok', answer: true }
            if (string === 'no' || string === 'n')
                return { type: 'Ok', answer: false }
            return { type: 'Retype', message: 'Your answer (y/n): ' }
        },
        stringifyQuestion: (question) =>
            `Answer "yes" if given number is prime. Otherwise answer "no".\n` +
            `Question: ${question.num}\n` +
            `Your answer: `,
        stringifyResult: (result, answer, question, input) => {
            if (result === `Valid`)
                return `Correct!`
            else if (result === `Fail`)
                return `'${input}' is wrong answer ;(. Correct answer was '${question.validAnswer ? 'yes' : 'no'}'.`
            else
                throw Error(`unreachable result ${result}`)
        },
        stringifyGameResult: (gameResult) => {
            if (gameResult.invalidAnswers === 0)
                return `Congratulations, ${username}!`
            else
                return `Let's try again, ${username}!`
        }
    })
}
