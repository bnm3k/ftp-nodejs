const path = require("path");
const fs = require("fs");
const { style } = require("./style");

const handleListDirContents = ([dirPath]) => {
    try {
        const results = fs.readdirSync(dirPath || process.cwd(), {
            withFileTypes: true
        });
        const parsed = [];
        results.map(entry => {
            if (entry.isFile()) parsed.push(style.file(entry.name));
            else if (entry.isDirectory() && !entry.name.startsWith("."))
                parsed.push(style.dir(entry.name + "/"));
        });
        return "\n" + parsed.join("\n");
    } catch (err) {
        return style.err(`Invalid dir path: "${dirPath}"`);
    }
};

const handleChangeDir = ([dirPath]) => {
    try {
        if (!path.isAbsolute(dirPath))
            dirPath = path.resolve(process.cwd(), dirPath);
        if (fs.statSync(dirPath).isDirectory()) {
            process.chdir(dirPath);
            return style.dir("OK");
        } else return style.err(`Invalid dir path: "${dirPath}"`);
    } catch (err) {
        console.log(err);
        if (!dirPath) return style.err(`Provide a valid non-empty dirpath`);
        return style.err(`Invalid dir path: "${dirPath}"`);
    }
};

const handleQuit = () => {
    console.log(style.res("\nBye Bye\n"));
    process.exit();
};

const handlePWD = () => style.dir(process.cwd());

module.exports = {
    handleQuit,
    handlePWD,
    handleListDirContents,
    handleChangeDir
};
