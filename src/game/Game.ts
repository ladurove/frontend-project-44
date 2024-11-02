import {Expectation} from "../Expectation";

export interface Game<QUESTION, ANSWER> {
    /**
     * @return null если игра закончена
     */
    next(): Promise<null | Expectation<ANSWER, {type: "Ok"} | {type: "Retype", description: string}>>
}
