### 1. Introduction

The following is an overview of, to use a lofty term, the 'architecture' of a File Transfer Protocol (FTP) client and server implementation I wrote in javascript (node.js). It covers the overall design, various considerations, decisions and protocols, messaging protocols and caveats, particularly in ways that deviate from standardized FTP. The code is entirely open-source. I took up working on this FTP program so as to challenge myself to code a non-trivial, non-web-dev intermediate level node.js project. As such, the code is mostly learning-oriented rather than production-oriented. Regrettably, I did not write much tests, instead relying on 'hand-testing' as I went along. I hope though to add tests soon enough.

### 2. Code structure

### 3. Setting up the Client CLI

Having never written a node.js based CLI before, I assumed that I'd have to do a lot of reading from stdin, writing to stdout manually. Before setting out, I decided to check out 'prior art' (code samples, blog posts etc) for general guidance, and also for any modules that might ease out writing CLIs. Three modules that kept on being used were: [`Commander.js`](https://github.com/tj/commander.js/) , [`ink`](https://github.com/vadimdemedes/ink) and [`Inquirer.js`]([https://github.com/SBoudrias/Inquirer.js#documentation](https://github.com/SBoudrias/Inquirer.js#documentation).

#### Overview of CLI modules considered

`Commander.js` seemed more suitable for one-off scripts and parsing command-line arguments; the FTP Client CLI would have to accomodate a higher level interactivity since the user should be able to issue commands and receive replies back and forth.

`ink` on the other hand seemed perfect for the task at hand. As its description states:

> React for CLIs. Build and test your CLI output using components.

Luckily, I already knew enough React to be dangerous. Furthermore, given that a client-session would have to maintain some sort of state (e.g. the client's current working directory), I was tempted to go all in and base the CLI on `ink` since IMO, React provides great abstractions to reason about state. (Spoiler alert, I ended up 'splitting' the state so that all state that's relevant for client-side commands is maintained in the client and all the state that's relevant for server-side commands is maintained in ther server). Back to ink, despite `ink`'s straightforwardness, a part of me felt that maybe React is a little too heavy for a simple CLI. Still, I decided to check it out and take it for a test-drive but quickly moved on to the next option after seeing that I have to set up babel and a bunch of other stuff so as to use it 😅.

The last option was `inquirer`. From afar, `inquirer` involves creating an array of questions for which the user provides answers via the terminal, and have the answers processed. It also provides additional features such as preprocessing answers and validations. Questions have 'types' amongst other attributes. I decided to use `inquirer`. I also add the plugin `inquirer-command-prompt` to `inquirer` which I used to incorporate _autocomplete_ and _history_ of commands that a user could navigate through via the up-down arrow keys. I was able to implement most of the client-side commands sometimes awkwardly, sometimes elegeantly. That was until ...

#### ctrl-c doesn't work as it should 😕

I had written a `cleanup` function that was supposed to be called whenever the user intended to quit- either by issuing a `quit` command or via _ctrl-c_. But for some reason _ctrl-c_ wasn't working as expected. I read and reread `inquirer`'s the documentation to see if I had missed something. After a while, I found out that `inquirer-command-prompt` lets us add an onClose function to be ran when the user presess ctrl-c. However, given how I'd structured the code above, `cleanup` would be ran on each iteration rather than solely when a user intends to quit.

Before considering a full rewrite, I decided to check the Issues section of `inquirer` figuring that probably someone somewhere also faced the same problem.

And bingo! found it. You can check it out on this [link](https://github.com/SBoudrias/Inquirer.js/issues/293). Turns out the problem came from some library that inquirer uses underneath to capture the input. The culprit - `readline`, which doesn't let the SIGINT event propagate back to our process due to some mumbo-jumbo.

With another quick glance, I found the [solution](https://github.com/SBoudrias/Inquirer.js/issues/293#issuecomment-422890996) right at the bottom, courtesy of _jbreeden-splunk_. Read through it, _jbreeden-splunk_ gives a much more straightforward explanation of what the problem is and their solution, which I modified a bit to suit the code I had thus far:

```javascript
//add these 2 lines near the top of client.js
const noop = () => {};
const noopInterval = setInterval(noop, 10000);

const cleanup = () => {
    //cleanup
    console.log("bye bye!");
    clearInterval(noopInterval);
    process.exit();
};
```

The SIGINT event-handler then worked as it should; even though it felt kinda clanky, still, it worked ¯\\_(ツ)_/¯.

#### exit inquirer, enter readline

Before proceeding further, I decided to check out what this `readline` module is all about. Turns out [`readline`](https://nodejs.org/api/readline.html) is part of node.js's standard library. For starters, turns out I could do away with the initial fix (the setInterval, clearInterval voodoo) and just attach a SIGINT listener directly on the `readline` instance instead of on `process`. Moreover, `readline`'s simplicity and minimalism meant I had more freedom to structure my code as I pleased. At that point, the client CLI code wasn't too large so I opted to switch from `inquirer` and do a full rewrite instead.

### 4. Implementing Client-side commands

### 5. Setting up the Server

### 6. The Client-Server Message protocol

### 7. FDTree: Exposing a logical file-system

### 8. Importing directories

### 9. Implementing Server-side commands

### 10. Reliable File Transfer

### 11. Security and Encryption

### 12. Conclusion
