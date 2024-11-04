import {getUsername} from "./getUsername";
import {runEvenGame} from "./games/evenGame";
import {runGcdGame} from "./games/gcdGame";
import {randomOf, readln} from "./libs";
import {MutableQueue} from "./libs/Queue";
import {Game} from "./game/backend/Game";
import {GameController} from "./game/backend/GameController";
import {GameFinishError} from "./game/builder/GameFinishError";
import {buildSimpleGame} from "./game/builder/buildSimpleGame";
import {CalcGame} from "./games/calcGame";
import {WithMaxIterations} from "./game/modifiers/WithMaxIterations";
import {WithTermResult} from "./game/modifiers/WithTermResult";


// const username = await getUsername()
// await runCalcGame(username)
// await runEvenGame(username)
// await runGcdGame(username)













async function runConsoleGame<QUESTION, ANSWER, RESULT, GAME_RESULT>(
    game: Game<QUESTION, ANSWER, RESULT, GAME_RESULT>,
    config: Readonly<{
        deserializeAnswer: (string: string) => ANSWER,
        stringifyQuestion?: (question: QUESTION) => string | undefined,
        stringifyResult?: (result: RESULT, answer: ANSWER, question: QUESTION) => string | undefined,
        stringifyGameResult?: (result: GAME_RESULT) => string | undefined,
    }>
) {
    while (true) {
        const next = await game.questions.next()
        if (next.done) {
            const text = config.stringifyGameResult?.call(null, next.value)
            if (text !== undefined)
                console.log(text)
            break
        }
        const [question, resolveQuestion] = next.value

        const answer = config.deserializeAnswer(await readln(
            config.stringifyQuestion?.call(null, question)
        ))

        const result = await resolveQuestion(answer)
        ;(() => {
            const text = config.stringifyResult?.call(null, result, answer, question)
            if (text !== undefined)
                console.log(text)
        })();
    }
}



const username = await getUsername()
const game = WithTermResult(
    WithMaxIterations(CalcGame(), 5),
    (result) => result === 'Fail'
)

console.log(`Hello, ${username}!`)
await runConsoleGame(game, {
    deserializeAnswer: (string) => parseInt(string),
    stringifyQuestion: (question) =>
        `What is the result of the expression?\n` +
        `Question: ${question.a} ${question.operation} ${question.b} (${question.validAnswer})\n` +
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
        else if (gameResult.validAnswers > gameResult.invalidAnswers)
            return `Good, ${username}!`
        else
            return `Let's try again, ${username}!`
    }
})
