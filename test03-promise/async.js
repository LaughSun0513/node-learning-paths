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

// async/await
async function getRes(){
  const aData = await getFileContent('1.json');
  console.log(aData);

  const bData = await getFileContent(aData.next);
  console.log(bData);

  const cData = await getFileContent(bData.next);
  console.log(cData);
}
getRes();