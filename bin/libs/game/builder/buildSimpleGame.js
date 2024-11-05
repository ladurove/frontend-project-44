/* eslint-disable */
import { GameController } from "../backend/GameController.js";
import { GameFinishError } from "./GameFinishError.js";
export function buildGame(iter) {
    return buildSimpleGame(iter);
}
export function buildSimpleGame(iter) {
    let onFinishRequest;
    const controller = GameController();
    const builder = {
        next: (...args) => controller._next(...args),
        finish: (...args) => {
            controller.finish(...args);
            throw new GameFinishError();
        },
        onFinishRequest(block) {
            onFinishRequest = async () => {
                const result = await block();
                controller.finish(result);
                return result;
            };
        }
    };
    const game = {
        get isActive() { return controller.isActive; },
        get questions() { return controller.questions; },
        await: () => controller.await(),
        requestFinish: async () => {
            if (onFinishRequest === undefined)
                throw Error("early finishing is not supported by this game");
            if (!controller.isActive)
                return controller.asFinished();
            return await onFinishRequest();
        }
    };
    iter(builder)
        .then((gameResult) => {
        if (game.isActive)
            controller.finish(gameResult);
        // console.log("     LOG: Game finished successfully")
    })
        .catch((err) => {
        if (err instanceof GameFinishError) {
            // console.log("     LOG: Game finished successfully")
        }
        else {
            console.log(`     LOG: Game finished with exception ${JSON.stringify(err)}`);
            throw err;
        }
    });
    return game;
}
