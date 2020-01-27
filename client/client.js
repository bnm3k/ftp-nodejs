const readline = require("readline");
const chalkPipe = require("chalk-pipe");
const path = require("path");
const fs = require("fs");

const style = {
    prompt: chalkPipe("green"),
    res: chalkPipe("#bfff00"), //light-ish green
    err: chalkPipe("red"),
    file: chalkPipe("yellow"),
    dir: chalkPipe("orange")
};

const readlineOpts = {
    input: process.stdin,
    output: process.stdout,
    prompt: style.prompt("> "),
    terminal: true,
    historySize: 10,
    removeHistoryDuplicates: true
};

const listDirContents = (ctx, dirPath) => {
    try {
        const results = fs.readdirSync(dirPath || ctx.cwd, {
            withFileTypes: true
        });
        const parsed = [];
        results.map(entry => {
            if (entry.isFile()) parsed.push(style.file(entry.name));
            else if (entry.isDirectory() && !entry.name.startsWith("."))
                parsed.push(style.dir(entry.name + "/"));
        });
        return "\t" + parsed.join("\n\t");
    } catch (err) {
        return style.err(`Invalid dir path: "${dirPath}"`);
    }
};

const changeDir = (ctx, dirPath) => {
    try {
        if (!path.isAbsolute(dirPath)) dirPath = path.resolve(ctx.cwd, dirPath);
        if (fs.statSync(dirPath).isDirectory()) {
            ctx.cwd = dirPath;
            return style.dir(dirPath);
        } else return style.err(`Invalid dir path: "${dirPath}"`);
    } catch (err) {
        return style.err(`Invalid dir path: "${dirPath}"`);
    }
};

const cmdHandlers = {
    QUIT: ctx => ctx.rl.close(),
    "!PWD": ctx => style.dir(ctx.cwd),
    "!LS": listDirContents,
    "!CD": changeDir
};

const handleInput = (ctx, input) => {
    let [cmd, ...args] = input.split(/\s+/);

    if (cmd in cmdHandlers) {
        const response = cmdHandlers[cmd](ctx, ...args);
        return response;
    } else {
        return style.err("Invalid command");
    }
};

const main = () => {
    const rl = readline.createInterface(readlineOpts);
    const ctx = { rl, cwd: process.cwd() };

    const cleanup = () => {
        console.log(style.res("\nbye bye!\n"));
        process.exit(0);
    };

    ctx.rl = rl;
    console.log(style.prompt("Client CLI"));

    rl.prompt();
    rl.on("line", userInput => {
        const res = handleInput(ctx, userInput);
        console.log("\n" + res + "\n");
        rl.prompt();
    }).on("close", cleanup);
};

main();
