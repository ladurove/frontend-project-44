/* eslint-disable */
import { buildGame } from "../../libs/game/builder/buildSimpleGame.js";
function isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0)
            return false;
    return num > 1;
}
function createQuestion() {
    const num = Math.round(Math.random() * 10);
    return { num, validAnswer: isPrime(num) };
}
export const PrimeGame = () => buildGame(async (builder) => {
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
