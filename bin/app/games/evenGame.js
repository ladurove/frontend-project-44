/* eslint-disable */
import { buildGame } from "../../libs/game/builder/buildSimpleGame.js";
function createQuestion() {
    const num = Math.round(Math.random() * 10);
    const isEven = num % 2 == 0;
    return { num, validAnswer: isEven };
}
export const EvenGame = () => buildGame(async (builder) => {
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
