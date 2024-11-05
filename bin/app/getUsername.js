/* eslint-disable */
import { readln } from "../libs/libs.js";
export async function getUsername() {
    console.log("Welcome to the Brain Games!");
    return await readln("May I have your name? ");
}
