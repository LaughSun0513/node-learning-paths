const express = require('express')
const http = require('http')
const Ws = require('ws').Server
const app = express()
const server = http.createServer(app)
server.listen(8181)
app.use(express.static('www'))

let wsServer = new Ws({ server })
wsServer.on('connection', socket => {
    console.log('连接成功');
    // 监听客户端发过来的消息
    socket.on('message', msg => {
        console.log('客户端发送过来的消息：' + msg);
        // 服务器给客户端发送消息
        socket.send('服务器说：你好客户端')
    })
});