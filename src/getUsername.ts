import {readln} from "./libs";

export async function getUsername(): Promise<string> {
    console.log("Welcome to the Brain Games!")
    return await readln("May I have your name? ")
}