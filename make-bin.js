/* eslint-disable */
import * as fs from "node:fs";
import { execSync } from "node:child_process";
if (fs.existsSync('./bin'))
    fs.rmSync('./bin', { recursive: true });
execSync('tsc');
(() => {
    const files = fs.readdirSync('./', { recursive: true })
        .filter(it => it.toString().startsWith("bin") || it.toString().startsWith("packages"))
        .filter(it => !it.includes("node_modules"))
        .filter(it => it.toString().endsWith('.js') && fs.statSync(`./${it}`).isFile());
    for (const filename of files) {
        const content = fs.readFileSync(`./${filename}`, 'utf-8');
        const newContent = "/* eslint-disable */\n" + content;
        fs.writeFileSync(`./${filename}`, newContent);
    }
})();
(() => {
    const files = fs.readdirSync('./bin')
        .filter(it => fs.statSync(`./bin/${it}`).isFile());
    for (const filename of files) {
        const content = fs.readFileSync(`./bin/${filename}`, 'utf-8');
        const newContent = "#!/usr/bin/env node\n" + content;
        fs.writeFileSync(`./bin/${filename}`, newContent);
    }
})();
