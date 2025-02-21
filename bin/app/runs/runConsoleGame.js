import { readln } from "../../packages/stdlibs/libs.js";
export async function runConsoleGame(game, config) {
    while (true) {
        const next = await game.questions.next();
        if (next.done) {
            const text = config.stringifyGameResult?.call(null, next.value);
            if (text !== undefined)
                console.log(text);
            break;
        }
        const [question, resolveQuestion] = next.value;
        const [input, answer] = await (async () => {
            let message = config.stringifyQuestion?.call(null, question);
            while (true) {
                const input = await readln(message);
                const deserializeResult = config.deserializeAnswer(input, question);
                if (deserializeResult.type === 'Ok')
                    return [input, deserializeResult.answer];
                message = deserializeResult.message;
            }
        })();
        const result = await resolveQuestion(answer);
        (() => {
            const text = config.stringifyResult?.call(null, result, answer, question, input);
            if (text !== undefined)
                console.log(text);
        })();
    }
}
