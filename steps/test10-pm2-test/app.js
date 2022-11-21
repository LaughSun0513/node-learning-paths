const http = require('http');

http.createServer((req,res)=>{
  // 模拟日志
  console.log('cur time',Date.now());
  console.error('error',Date.now());
  // 模拟错误
  if(req.url === '/err'){
    throw new Error('error')
  }
  res.end('Hello ,PM1 by app.js');
}).listen(7000,()=>{
  console.log('server is listen on port 7000')
})