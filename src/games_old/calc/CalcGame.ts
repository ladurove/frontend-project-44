// import {Game} from "../Game";
// import {randomOf} from "../../libs/randomOf";
// import {never} from "../../libs/never";
//
// export namespace CalcGame {
//     export type Operation = "+" | "-" | "*"
//     export type Question = {
//         operation: Operation,
//         a: number,
//         b: number
//     }
// }
//
// export class CalcGame implements Game<CalcGame.Question, number> {
//     next(): CalcGame.Question {
//         return CalcGame.generateQuestion()
//     }
//
//     check(question: CalcGame.Question, answer: number): boolean {
//         return answer === CalcGame.calc(question)
//     }
//
//     private static calc(question: CalcGame.Question): number {
//         if (question.operation === '+')
//             return question.a + question.b
//         else if (question.operation === '-')
//             return question.a - question.b
//         else if (question.operation === '*')
//             return question.a * question.b
//         else never(question.operation)
//     }
//
//     private static operations: CalcGame.Operation[] = ["+", "-"]
//     private static generateQuestion(): CalcGame.Question {
//         return {
//             operation: randomOf(CalcGame.operations),
//             a: Math.round(Math.random() * 10),
//             b: Math.round(Math.random() * 10),
//         }
//     }
// }
