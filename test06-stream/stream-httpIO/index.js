const http = require('http');
const fs = require('fs');
const path = require('path');

//将文件1的内容通过stream输出返回至客户端 -- 1
const filename1 = path.resolve(__dirname,'./1.txt');

const server = http.createServer((req,res)=>{
  if(req.method === "GET"){
     const readStream = fs.createReadStream(filename1); //2
     readStream.pipe(res); //3
  } 
})
server.listen(8005);