const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 寻找目标日志文件
const fileName = path.join(__dirname, '../logs/access.log');

// 创建读取流 
const readStream = fs.createReadStream(fileName);

// 创建readline对象
const rl = readline.createInterface({
  input: readStream
});

// 计数器
let chromeNum = 0;
let sum = 0;

// 逐行读取
rl.on('line', (lineData) => {
  if (!lineData) {
    return;
  };
  sum++;

  // 获取Chrome浏览器的日志信息
  // GET -- /api/blog/list -- Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36 -- 1572693248592
  let logArr = lineData.split(' -- '); // 根据--日志格式拆分
  if (logArr[2] && logArr[2].indexOf('Chrome') > 0) {
    chromeNum++;
  }
});

rl.on('close', () => {
  let res = parseFloat(chromeNum / sum).toFixed(2) * 100 + "%";
  console.log('chrome浏览器占比:' + res);
})