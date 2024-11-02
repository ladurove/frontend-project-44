// import * as readline from "node:readline/promises";
// import {CalcGame} from "./games_old/calc/CalcGame";
// import {createGame} from "./game_old/builder/gameOf";
//
// const readlineInterface = readline.createInterface({input: process.stdin, output: process.stdout})
//
// const r = await readlineInterface.question("qwe: ")
// console.log(r)
//
//
// // const game_old = new CalcGame()
// //
// // for (let _ = 0; _ < 3; _++) {
// //     const question = game_old.next()
// //     const answer = parseInt(await readlineInterface.question(`${question.a} ${question.operation} ${question.b}: `))
// //     if (game_old.check(question, answer)) {
// //         console.log("Good!")
// //     } else {
// //         console.log("ахаха долбоеб")
// //         break
// //     }
// // }
//
//
//
// const calcGame = createGame<{a: number, b: number, operation: '+' | '-' | '*'}, number, boolean, void>(async (controller) => {
//     const answer = await controller.question({a: 12, b: 12, operation: '-'})
//     controller.complete(answer === 0)
// })
//
//
//
// const game = await calcGame.play()
// while (true) {
//     const [question, resolveQuestion] = await game.next()
//     const answer = parseInt(await readlineInterface.question(`${question.a} ${question.operation} ${question.b}: `))
//     const result = await resolveQuestion.answer(answer)
// }
//
//
//
// // посылается с бека. Фронт отвечает
// interface GameRequest<REQUEST, ANSWER> {}
//
//
// type SomeGameRequestGetUsername = GameRequest<{type: "GetUsername", maxLength: number}, string>
// type SomeGameRequests = SomeGameRequestGetUsername
//
// const SomeGameNotation = createGame<SomeGameRequests>(async (gameBackend) => {
//     const username = await gameBackend.request({type: "GetUsername", maxLength: 16})
//
// })







