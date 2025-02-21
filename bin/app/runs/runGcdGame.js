import { getUsername } from "../getUsername.js";
import { runConsoleGame } from "./runConsoleGame.js";
import { WithTermResult } from "../../packages/game/modifiers/WithTermResult.js";
import { WithMaxIterations } from "../../packages/game/modifiers/WithMaxIterations.js";
import { createGcdGame } from "../../packages/braingames/gcdGame.js";
export async function runGcdGame() {
    const username = await getUsername();
    const game = WithTermResult(WithMaxIterations(createGcdGame(), 3), (result) => result === 'Fail');
    console.log(`Hello, ${username}!`);
    await runConsoleGame(game, {
        deserializeAnswer: (string) => ({
            type: 'Ok', answer: parseInt(string)
        }),
        stringifyQuestion: (question) => `Find the greatest common divisor of given numbers.\n` +
            `Question: ${question.a} ${question.b}\n` +
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
            else
                return `Let's try again, ${username}!`;
        }
    });
}
