const readline = require("readline");
const path = require("path");
const fs = require("fs");
const { style } = require("./utils/style");
const clientCmds = require("./utils/clientCmds");

const readlineOpts = {
    input: process.stdin,
    output: process.stdout,
    prompt: style.prompt("> "),
    terminal: true,
    historySize: 10,
    removeHistoryDuplicates: true
};

const cmdHandlers = {
    quit: clientCmds.handleChangeDir,
    "!pwd": clientCmds.handlePWD,
    "!ls": clientCmds.handleListDirContents,
    "!cd": clientCmds.handleChangeDir
};

const handleInput = async input => {
    let [cmd, ...args] = input.split(/\s+/);
    cmd = cmd.toLowerCase();
    if (cmd in cmdHandlers) {
        const response = cmdHandlers[cmd](args);
        return response;
    } else {
        return style.err("Invalid command");
    }
};

const main = () => {
    const rl = readline.createInterface(readlineOpts);

    const cleanup = () => {
        console.log(style.res("\nbye bye!\n"));
        process.exit(0);
    };

    console.log(style.prompt("Client CLI"));

    rl.prompt();
    rl.on("line", userInput => {
        handleInput(userInput).then(res => {
            console.log("\n" + res + "\n");
            rl.prompt();
        });
    }).on("close", cleanup);
};

main();
