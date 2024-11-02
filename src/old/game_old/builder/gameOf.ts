// import {CalcGame} from "../../games_old/calc/CalcGame"
// import {GameNotation} from "../GameNotation";
// import {GameController} from "./GameController";
// import {Game} from "../Game";
// import { GameQuestion } from "../GameQuestion";
// import {MutableAsyncQueue} from "../../libs/AsyncQueue";
//
//
// class MutableGame<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT> implements Game<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>, GameController<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT> {
//     private queue = MutableAsyncQueue<[QUESTION, GameQuestion<ANSWER>]>()
//     private result: RESULT | undefined
//     private completePromise: Promise<void>
//     private completePromiseResolver!: () => void
//     constructor(
//
//     ) {
//         this.completePromise = new Promise((resolve) => {
//             this.completePromiseResolver = resolve
//         })
//     }
//
//
//     next(): Promise<[QUESTION, GameQuestion<ANSWER>]> {
//         return this.queue.next()
//     }
//
//     async await(): Promise<RESULT> {
//         await this.completePromise
//         return this.result as RESULT
//     }
//
//     question(question: QUESTION): Promise<[ANSWER, (answerResult: ANSWER_RESULT) => void]> {
//         return new Promise((resolve) => {
//             this.queue.push([question, {
//                 answer(answer: ANSWER) {
//                     resolve(answer)
//                 }
//             }])
//         })
//     }
//
//     complete(result: RESULT): void {
//         this.result = result
//         this.completePromiseResolver()
//     }
// }
//
// class GameNotationImpl<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT> implements GameNotation<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT> {
//     private readonly _play: () => Promise<Game<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>>
//     constructor(
//         play: () => Promise<Game<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>>
//     ) {
//         this._play = play
//     }
//
//     play(): Promise<Game<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>> {
//         return this._play()
//     }
// }
//
// export function createGame<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>(
//     block: (controller: GameController<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>) => void
// ): GameNotation<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT> {
//     return new GameNotationImpl<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>(async () => {
//         const mutableGame = new MutableGame<QUESTION, ANSWER, ANSWER_RESULT, GAME_RESULT>()
//         block(mutableGame)
//         return mutableGame
//     })
// }
