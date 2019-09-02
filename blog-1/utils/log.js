const fs =require('fs');
const path = require('path');

//生成write stream
function createWriteStream(fileName){
     const fullFileName = path.resolve(__dirname,'./','../','logs',fileName);
     const writeStream = fs.createWriteStream(fullFileName,{
        flags:'a' //append 追加写日志
     });
     return writeStream;
}

const accessWriteStream = createWriteStream('access.log');

function writeLog(writeStream,log){
  writeStream.write(log + '\n'); //关键
}
function access(log){
  writeLog(accessWriteStream,log);
}

module.exports = {
  access
}