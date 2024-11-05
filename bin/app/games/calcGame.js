import { randomOf } from "../../libs/libs.js";
import { buildGame } from "../../libs/game/builder/buildSimpleGame.js";
function createQuestion() {
    const num1 = Math.round(Math.random() * 10);
    const num2 = Math.round(Math.random() * 10);
    const operation = randomOf(["+", "-", "*"]);
    const result = (() => {
        if (operation === '+')
            return num1 + num2;
        if (operation === '-')
            return num1 - num2;
        if (operation === '*')
            return num1 * num2;
        throw Error('unreachable');
    })();
    return { a: num1, b: num2, operation: operation, validAnswer: result };
}
export const CalcGame = () => buildGame(async (builder) => {
    let validAnswers = 0;
    let invalidAnswers = 0;
    builder.onFinishRequest(async () => ({ validAnswers, invalidAnswers }));
    while (true) {
        const question = createQuestion();
        const [answer, answerResolve] = await builder.next(question);
        if (answer === question.validAnswer) {
            validAnswers++;
            answerResolve("Valid");
        }
        else {
            invalidAnswers++;
            answerResolve("Fail");
        }
    }
});
