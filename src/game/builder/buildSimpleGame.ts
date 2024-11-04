import {Game} from "../backend/Game";
import {GameController} from "../backend/GameController";
import {GameFinishError} from "./GameFinishError";


export function buildGame<
    GAME extends Game<any, any, any, any>,
    QUESTION = GAME extends Game<infer QUESTION, any, any, any> ? QUESTION : never,
    ANSWER = GAME extends Game<any, infer ANSWER, any, any> ? ANSWER : never,
    RESULT = GAME extends Game<any, any, infer RESULT, any> ? RESULT : never,
    GAME_RESULT = GAME extends Game<any, any, any, infer GAME_RESULT> ? GAME_RESULT : never
>(
    iter: (builder: GameBuilder<QUESTION, ANSWER, RESULT, GAME_RESULT>) => Promise<GAME_RESULT>
): Game<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    return buildSimpleGame(iter)
}

export function buildSimpleGame<QUESTION, ANSWER, RESULT, GAME_RESULT>(
    iter: (builder: GameBuilder<QUESTION, ANSWER, RESULT, GAME_RESULT>) => Promise<GAME_RESULT>
): Game<QUESTION, ANSWER, RESULT, GAME_RESULT> {
    const controller = GameController<QUESTION, ANSWER, RESULT, GAME_RESULT>()

    const builder: GameBuilder<QUESTION, ANSWER, RESULT, GAME_RESULT> = {
        next: (...args) => controller._next(...args),
        finish: (...args): never => {
            controller.finish(...args)
            throw new GameFinishError()
        }
    }

    const game: Game<QUESTION, ANSWER, RESULT, GAME_RESULT> = {
        get isActive() { return controller.isActive },
        get questions() { return controller.questions },
        await: () => controller.await(),
    }

    iter(builder)
        .then((gameResult) => {
            if (game.isActive)
                controller.finish(gameResult)
            // console.log("     LOG: Game finished successfully")
        })
        .catch((err) => {
            if (err instanceof GameFinishError) {
                // console.log("     LOG: Game finished successfully")
            } else {
                console.log(`     LOG: Game finished with exception ${JSON.stringify(err)}`)
                throw err
            }
        })

    return game
}

