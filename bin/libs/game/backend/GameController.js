import { MutableQueue } from "../../Queue.js";
import { GameFinishError } from "../builder/GameFinishError.js";
export function GameController() {
    let gameResult;
    let finishGame;
    const finishGamePromise = new Promise((resolve) => {
        finishGame = (_gameResult) => {
            gameResult = _gameResult;
            resolve(_gameResult);
        };
    });
    const questionsQueue = MutableQueue();
    const controller = {
        isActive: true,
        questions: {
            next: async function () {
                if (!controller.isActive)
                    return { done: true, value: gameResult };
                const result = await questionsQueue.next();
                return { done: false, value: result };
            }
        },
        await: () => finishGamePromise,
        asFinished() {
            if (controller.isActive)
                throw Error('Game not finished!');
            return gameResult;
        },
        _next: async function (question) {
            if (!this.isActive)
                throw new GameFinishError();
            let resolveAnswer;
            const answerPromise = new Promise((resolve) => resolveAnswer = resolve);
            let resolveAnswerResult;
            const answerResultPromise = new Promise((resolve) => resolveAnswerResult = resolve);
            const q = [question, (answer) => {
                    resolveAnswer(answer);
                    return answerResultPromise;
                }];
            questionsQueue.push(q);
            return [await answerPromise, (answerResult) => {
                    resolveAnswerResult(answerResult);
                }];
        },
        finish: function (gameResult) {
            if (!this.isActive)
                throw Error('Already finished');
            this.isActive = false;
            finishGame(gameResult);
        }
    };
    return controller;
}
