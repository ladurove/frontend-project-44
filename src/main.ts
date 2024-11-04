import {getUsername} from "./getUsername";
import {EvenGame} from "./games/evenGame";
import {randomOf, readln} from "./libs";
import {MutableQueue} from "./libs/Queue";
import {Game} from "./game/backend/Game";
import {GameController} from "./game/backend/GameController";
import {GameFinishError} from "./game/builder/GameFinishError";
import {buildSimpleGame} from "./game/builder/buildSimpleGame";
import {CalcGame} from "./games/calcGame";
import {WithMaxIterations} from "./game/modifiers/WithMaxIterations";
import {WithTermResult} from "./game/modifiers/WithTermResult";
import {GcdGame} from "./games/gcdGame";


// const username = await getUsername()
// await runCalcGame(username)
// await runEvenGame(username)
// await runGcdGame(username)













async function runConsoleGame<QUESTION, ANSWER, RESULT, GAME_RESULT>(
    game: Game<QUESTION, ANSWER, RESULT, GAME_RESULT>,
    config: Readonly<{
        deserializeAnswer: (string: string) => { type: "Ok", answer: ANSWER } | { type: "Retype", message: string },
        stringifyQuestion?: (question: QUESTION) => string | undefined,
        stringifyResult?: (result: RESULT, answer: ANSWER, question: QUESTION, input: string) => string | undefined,
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

        const [input, answer] = await (async () => {
            let message = config.stringifyQuestion?.call(null, question)
            while (true) {
                const input = await readln(message)
                const deserializeResult = config.deserializeAnswer(input)
                if (deserializeResult.type === 'Ok')
                    return [input, deserializeResult.answer]
                message = deserializeResult.message
            }
        })();

        const result = await resolveQuestion(answer)
        ;(() => {
            const text = config.stringifyResult?.call(null, result, answer, question, input)
            if (text !== undefined)
                console.log(text)
        })();
    }
}



async function runCalcGame() {
    const username = await getUsername()
    const game = WithTermResult(
        WithMaxIterations(
            CalcGame(),
            5
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
                // else if (gameResult.validAnswers > gameResult.invalidAnswers)
            //     return `Good, ${username}!`
            else
                return `Let's try again, ${username}!`
        }
    })
}




async function runGcdGame() {
    const username = await getUsername()
    const game = WithTermResult(
        WithMaxIterations(
            GcdGame(),
            5
        ),
        (result) => result === 'Fail'
    )

    console.log(`Hello, ${username}!`)
    await runConsoleGame(game, {
        deserializeAnswer: (string) => ({
            type: 'Ok', answer: parseInt(string)
        }),
        stringifyQuestion: (question) =>
            `Find the greatest common divisor of given numbers.\n` +
            `Question: ${question.a} ${question.b} (${question.validAnswer})\n` +
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
            else
                return `Let's try again, ${username}!`
        }
    })
}




async function runEvenGame() {
    const username = await getUsername()
    const game = WithTermResult(
        WithMaxIterations(
            EvenGame(),
            5
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
            `Answer "yes" if the number is even, otherwise answer "no".\n` +
            `Question: ${question.num} (${question.validAnswer ? 'y' : 'n'})\n` +
            `Your answer(y/n): `,
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


// await runEvenGame()
await runGcdGame()
