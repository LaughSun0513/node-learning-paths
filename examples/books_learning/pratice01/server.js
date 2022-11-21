const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const chatServer = require("./lib/chat_server");

const cache = {}; //缓存
const send404 = function(res) {
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.write("Error 404 : resource not found ");
    res.end();
};
const sendFile = function(res, filePath, fileContents) {
    res.writeHead(200, {
        "Content-Type": mime.getType(path.basename(filePath))
    });
    res.end(fileContents);
};
const log = console.log;

function serverStatic(res, cache, absPath) {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        log(absPath);
        fs.stat(absPath, fs.constants.F_OK, err => {
            if (err) {
                //不存在
                send404(res);
            } else {
                //存在
                fs.readFile(absPath, (err, data) => {
                    if (err) {
                        log(err);
                        send404(res);
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            }
        });
    }
}
const server = http.createServer((req, res) => {
    let filePath = false;
    filePath = (req.url == "/" && `public/index.html`) || `public${req.url}`;
    let absPath = "./" + filePath;
    serverStatic(res, cache, absPath);
});
server.listen(3000, () => {
    console.log("Server listening on Port 3000");
});
chatServer.listen(server);
