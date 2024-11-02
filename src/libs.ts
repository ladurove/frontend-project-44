import * as readline from "node:readline/promises";


const readlineInterface = readline.createInterface({input: process.stdin, output: process.stdout})

export function readln(question: string = ""): Promise<string> {
    return readlineInterface.question(question)
}

export function randomOf<T>(array: T[]): T {
    if (array.length === 0) throw Error('Cannot take a random value from empty array')
    const index = Math.round(Math.random() * (array.length - 1))
    return array.at(index) as T
}

