const fs = require('fs');
const path = require('path');

//封装读取文件的函数
function getFileContent(fileName,callback){
    const fullFileName = path.resolve(__dirname,'files',fileName);
    fs.readFile(fullFileName,(err,data)=>{
        if(err){
          console.error(err);
          return;
        }
        callback(JSON.parse(data.toString()));
    })
}
//测试:通过callback获取文件
getFileContent("1.json",aData=>{
  console.log(aData);
  getFileContent(aData.next,bData=>{
    console.log(bData);
    getFileContent(bData.next,cData=>{
      console.log(cData);
    })
  })
})