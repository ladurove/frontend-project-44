import { readln } from '../../stdlibs/libs.js';

export default async function runConsoleGame(game, config) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const next = await game.questions.next();
    if (next.done) {
      const text = config.stringifyGameResult?.call(null, next.value);
      if (text !== undefined) { console.log(text); }
      break;
    }
    const [question, resolveQuestion] = next.value;

    // eslint-disable-next-line no-await-in-loop
    const [input, answer] = await (async () => {
      let message = config.stringifyQuestion?.call(null, question);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const newInput = await readln(message);
        const deserializeResult = config.deserializeAnswer(newInput, question);
        if (deserializeResult.type === 'Ok') { return [newInput, deserializeResult.answer]; }
        message = deserializeResult.message;
      }
    })();

    // eslint-disable-next-line no-await-in-loop
    const result = await resolveQuestion(answer);
    (() => {
      const text = config.stringifyResult?.call(null, result, answer, question, input);
      if (text !== undefined) { console.log(text); }
    })();
  }
}
