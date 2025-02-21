export interface GameBuilder<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    next(question: QUESTION): Promise<[ANSWER, (result: RESULT) => void]>
    finish(gameResult: GAME_RESULT): never

    onFinishRequest(block: () => Promise<GAME_RESULT>): void
}
