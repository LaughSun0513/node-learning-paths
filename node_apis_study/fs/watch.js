const fs = require('fs');
const path = require('path');

const testDir = path.resolve(__dirname, './testdir');

fs.watch(testDir, {
    // 递归监控文件夹下的文件
    recursive: true
}, (eventType, fileName) => {
    console.log(eventType)
    console.log(fileName)
})
