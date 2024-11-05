import { buildGame } from "../../libs/game/builder/buildSimpleGame.js";
function createProgression(length = 10) {
    const num = Math.max(1, Math.round(Math.random() * 10));
    const startNum = Math.round(Math.random() * 20);
    const nums = (() => {
        const nums = [startNum];
        for (let i = 0; i < length - 1; i++) {
            nums.push(nums[i] + num);
        }
        return nums;
    })();
    const [before, after, validAnswer] = (() => {
        const gap = Math.round(Math.random() * length);
        const before = nums.slice(0, gap - 1);
        const after = nums.slice(gap, nums.length);
        return [before, after, nums[gap - 1]];
    })();
    return { before, after, validAnswer };
}
export const ProgressionGame = () => buildGame(async (builder) => {
    let validAnswers = 0;
    let invalidAnswers = 0;
    builder.onFinishRequest(async () => ({ validAnswers, invalidAnswers }));
    while (true) {
        const question = createProgression();
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
