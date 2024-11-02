import {readln} from "../libs";

function findGcd(num1: number, num2: number): number {
    const max = Math.max(num1, num2)
    let gcd = 1
    for (let _ = 1; _ <= max; _++) {
        if (num1 % _ === 0 && num2 % _ === 0)
            gcd = _
    }
    return gcd
}

export async function runGcdGame(
    username: string
) {
    console.log(`Hello, ${username}!`)
    for (let iteration = 1; iteration < 4; iteration++) {
        const num1 = Math.ceil(Math.random() * 10)
        const num2 = Math.ceil(Math.random() * 10)
        const correctGcd = findGcd(num1, num2)
        console.log(`Find the greatest common divisor of given numbers.`)
        console.log(`Question: ${num1} ${num2} (${correctGcd})`)
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
        if (answer === correctGcd) {
            console.log("Correct!")
        } else {
            console.log(`'${answer}' is wrong answer ;(. Correct answer was '${correctGcd}'.`)
            console.log(`Let's try again, ${username}!`)
            return
        }
    }
    console.log(`Congratulations, ${username}!`)
}

