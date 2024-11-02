import {randomOf, readln} from "../libs";
import {Game} from "../game/Game";
import { Expectation } from "../Expectation";

const operations: ('+' | '-' | '*')[] = ["+", "-", "*"]


export class CalcGame implements Game<{ a: number, b: number, operation: '+' | '-' | '*' }, number> {
    next(): Promise<Expectation<number, { type: "Ok"; } | { type: "Retype"; description: string; }> | null> {
        throw new Error("Method not implemented.");
    }
}

export async function runCalcGame(
    username: string
) {
    console.log(`Hello, ${username}!`)
    for (let iteration = 1; iteration < 4; iteration++) {
        const num1 = Math.round(Math.random() * 10)
        const num2 = Math.round(Math.random() * 10)
        const operation = randomOf(operations)
        const result = (() => {
            if (operation === '+')
                return num1 + num2
            if (operation === '-')
                return num1 - num2
            if (operation === '*')
                return num1 * num2
            throw Error('unreachable')
        })()
        console.log(`What is the result of the expression?`)
        console.log(`Question: ${num1} ${operation} ${num2} (${result})`)
        const answer = await (async () => {
            while (true) {
                const answer = parseInt(await readln("Your answer: "))
                if (isNaN(answer)) {
                    console.log("Not a number!")
                    continue
                }
                return answer
            }
        })()
        if (result === answer) {
            console.log("Correct!")
        } else {
            console.log(`'${answer}' is wrong answer ;(. Correct answer was '${result}'.`)
            console.log(`Let's try again, ${username}!`)
            return
        }
    }
    console.log(`Congratulations, ${username}!`)
}
