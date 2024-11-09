import {getUsername} from "./app/getUsername.js";

const username = await getUsername()
console.log(`Hello, ${username}!`)
