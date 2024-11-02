import {randomOf, readln} from "../libs";


export async function runEvenGame(
    username: string
) {
    console.log(`Hello, ${username}!`)
    for (let iteration = 1; iteration < 4; iteration++) {
        const num = Math.round(Math.random() * 10)
        const isEven = num % 2 == 0
        const correctAnswer = isEven ? 'yes' : 'no'
        console.log(`Answer "yes" if the number is even, otherwise answer "no".`)
        console.log(`Question (y/n): ${num} (${correctAnswer})`)
        const answer = await (async () => {
            while (true) {
                const answer = await readln("Your answer: ")
                if (answer === 'yes' || answer === 'no')
                    return answer
                if (answer === 'y')
                    return 'yes'
                if (answer === 'n')
                    return 'no'
            }
        })()
        if (answer === correctAnswer) {
            console.log("Correct!")
        } else {
            console.log(`'${answer}' is wrong answer ;(. Correct answer was '${correctAnswer}'.`)
            console.log(`Let's try again, ${username}!`)
            return
        }
    }
    console.log(`Congratulations, ${username}!`)
}

