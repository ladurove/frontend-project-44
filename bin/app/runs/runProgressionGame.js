import { runConsoleGame } from "./runConsoleGame.js";
import {WithMaxIterations, WithTermResult} from "game";
import {getUsername} from "../getUsername.js";
import {ProgressionGame} from "braingames";

export async function runProgressionGame() {
    const username = await getUsername();
    const game = WithTermResult(WithMaxIterations(ProgressionGame.ProgressionGame(), 3), (result) => result === 'Fail');
    console.log(`Hello, ${username}!`);
    await runConsoleGame(game, {
        deserializeAnswer: (string) => ({
            type: 'Ok', answer: parseInt(string)
        }),
        stringifyQuestion: (question) => `What number is missing in the progression?\n` +
            (() => {
                const str = [];
                str.push("Question:");
                for (const b of question.before) {
                    str.push(` ${b}`);
                }
                str.push(" ..");
                for (const a of question.after) {
                    str.push(` ${a}`);
                }
                str.push('\n');
                return str.join('');
            })() +
            `Your answer: `,
        stringifyResult: (result, answer, question) => {
            if (result === `Valid`)
                return `Correct!`;
            else if (result === `Fail`)
                return `'${answer}' is wrong answer ;(. Correct answer was '${question.validAnswer}'.`;
            else
                throw Error(`unreachable result ${result}`);
        },
        stringifyGameResult: (gameResult) => {
            if (gameResult.invalidAnswers === 0)
                return `Congratulations, ${username}!`;
            // else if (gameResult.validAnswers > gameResult.invalidAnswers)
            //     return `Good, ${username}!`
            else
                return `Let's try again, ${username}!`;
        }
    });
}
