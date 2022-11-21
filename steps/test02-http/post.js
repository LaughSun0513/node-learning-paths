const http = require('http');
const log = console.log;

const server = http.createServer((req,res)=>{
    if(req.method ==="POST"){
      // req 数据格式
      log('req content-type',req.headers['content-type']);

      // 接收数据
      let postData = '';
      req.on('data',chunk=>{
        postData += chunk.toString();
      });
      req.on('end',()=>{
        log('postData',postData);
        res.end('hello post')
      })
    }
});
server.listen(8001);