import {getUsername} from "../getUsername.js";
import {WithTermResult} from "../../libs/game/modifiers/WithTermResult.js";
import {WithMaxIterations} from "../../libs/game/modifiers/WithMaxIterations.js";
import {CalcGame} from "../games/calcGame.js";
import {runConsoleGame} from "./runConsoleGame.js";


export async function runCalcGame() {
    const username = await getUsername()
    const game = WithTermResult(
        WithMaxIterations(
            CalcGame(),
            3
        ),
        (result) => result === 'Fail'
    )

    console.log(`Hello, ${username}!`)
    await runConsoleGame(game, {
        deserializeAnswer: (string) => ({
            type: 'Ok', answer: parseInt(string)
        }),
        stringifyQuestion: (question) =>
            `What is the result of the expression?\n` +
            `Question: ${question.a} ${question.operation} ${question.b}\n` +
            `Your answer: `,
        stringifyResult: (result, answer, question) => {
            if (result === `Valid`)
                return `Correct!`
            else if (result === `Fail`)
                return `'${answer}' is wrong answer ;(. Correct answer was '${question.validAnswer}'.`
            else
                throw Error(`unreachable result ${result}`)
        },
        stringifyGameResult: (gameResult) => {
            if (gameResult.invalidAnswers === 0)
                return `Congratulations, ${username}!`
                // else if (gameResult.validAnswers > gameResult.invalidAnswers)
            //     return `Good, ${username}!`
            else
                return `Let's try again, ${username}!`
        }
    })
}
