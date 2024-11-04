
export interface Game<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    isActive: boolean
    questions: AsyncIterator<[QUESTION, (answer: ANSWER) => Promise<RESULT>], GAME_RESULT>
    await(): Promise<GAME_RESULT> // ждет isActive === false
    requestFinish(): Promise<GAME_RESULT>
}
