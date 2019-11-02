const fs =require('fs');
const path = require('path');

/** 原理:先找到要装水流的水桶，这里是logs/access.log & logs/error.log & logs/event.log
 *  生成write stream
 *  再通过writeStream.write写入
 *  通过调用该函数来执行写入的过程
 */ 
function createWriteStream(fileName){
     const fullFileName = path.resolve(__dirname,'./','../','logs',fileName);
     const writeStream = fs.createWriteStream(fullFileName,{
        flags:'a' //append 追加写日志
     });
     return writeStream;
}

const accessWriteStream = createWriteStream('access.log');

function writeLog(writeStream,log){
  writeStream.write(log + '\n'); //关键 通过writeStream.write来写入
}
// 写入成功日志
function access(log){
  writeLog(accessWriteStream,log);
}
// 写入错误日志
function error(log){
  writeLog(accessWriteStream,log);
}
// 写入事件日志
function event(log){
  writeLog(accessWriteStream,log);
}
module.exports = {
  access,
  error,
  event
}