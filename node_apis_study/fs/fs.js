const {
    readFileSync,
    readFile
} = require('fs');
const log = console.log;

// 同步读取
const data = readFileSync('./1.txt');
log(data);
log(data.toString());

// 异步读取
readFile('./1.txt', (err, asyncData) => {
    if (err) throw err;
    log(asyncData);
    log(asyncData.toString());
});

(async () => {
    const { promisify } = require('util');
    const newRead = promisify(readFile);
    const data = await newRead('./1.txt');
    log(data);
    log(data.toString());
})()

