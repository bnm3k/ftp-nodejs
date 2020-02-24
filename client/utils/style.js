const chalkPipe = require("chalk-pipe");

const style = {
    prompt: chalkPipe("green"),
    res: chalkPipe("#bfff00"), //light-ish green
    err: chalkPipe("red"),
    file: chalkPipe("yellow"),
    dir: chalkPipe("orange")
};

module.exports = { style };
