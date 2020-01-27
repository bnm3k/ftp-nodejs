const net = require("net");
const server = net.createServer();

const PORT = process.argv[2] || 8000;

server.on("connection", clientConnection => {
    console.log({ clientConnection });
    clientConnection.write(Buffer.from("Hello World"));
});

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
