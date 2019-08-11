const fs = require('fs');
const path = require('path');

const filename1 = path.resolve(__dirname,'./1.txt');
const filename2 = path.resolve(__dirname,'./2.txt');

const readStream = fs.createReadStream(filename1);
const writeStream = fs.createWriteStream(filename2);

//将文件1.txt的内容通过流的方式 复制到 2.txt
readStream.pipe(writeStream);

//监听变化
readStream.on('data',chunk => {
    console.log(chunk.toString());
});
readStream.on('end',() => {
  console.log('copy done');
});