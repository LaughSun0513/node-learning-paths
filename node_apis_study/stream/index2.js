const http = require('http');
const server = http.createServer((req,res)=>{
  if(req.method === "POST"){
      req.pipe(res); //输入啥，返回啥，pipe就像水管，连接两头
  } 
})
server.listen(8000);