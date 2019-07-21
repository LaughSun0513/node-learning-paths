const fs = require('fs');
const path = require('path');

//封装读取文件的函数
function getFileContent(fileName){
    const promsie = new Promise((resolve,reject)=>{
      const fullFileName = path.resolve(__dirname,'files',fileName);
      fs.readFile(fullFileName,(err,data)=>{
          if(err){
            reject(err)
            return;
          }
          resolve(JSON.parse(data.toString()));
      })
    })
    return promsie;
}
//使用promise调用
getFileContent('1.json').then(aData=>{
  console.log(aData);
  return getFileContent(aData.next); //返回下一个promise
}).then(bData=>{
  console.log(bData);
  return getFileContent(bData.next)
}).then(cData=>{
  console.log(cData);
})
