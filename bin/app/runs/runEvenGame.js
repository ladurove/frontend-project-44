import { getUsername } from "../getUsername.js";
import { runConsoleGame } from "./runConsoleGame.js";
import { WithMaxIterations } from "../../packages/game/modifiers/WithMaxIterations.js";
import { WithTermResult } from "../../packages/game/modifiers/WithTermResult.js";
import { createEvenGame } from "../../packages/braingames/evenGame.js";
export async function runEvenGame() {
    const username = await getUsername();
    const game = WithTermResult(WithMaxIterations(createEvenGame(), 3), (result) => result === 'Fail');
    console.log(`Hello, ${username}!`);
    await runConsoleGame(game, {
        deserializeAnswer: (string) => {
            if (string === 'yes' || string === 'y')
                return { type: 'Ok', answer: true };
            if (string === 'no' || string === 'n')
                return { type: 'Ok', answer: false };
            return { type: 'Retype', message: 'Your answer (y/n): ' };
        },
        stringifyQuestion: (question) => `Answer "yes" if the number is even, otherwise answer "no".\n` +
            `Question: ${question.num}\n` +
            `Your answer: `,
        stringifyResult: (result, answer, question, input) => {
            if (result === `Valid`)
                return `Correct!`;
            else if (result === `Fail`)
                return `'${input}' is wrong answer ;(. Correct answer was '${question.validAnswer ? 'yes' : 'no'}'.`;
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
