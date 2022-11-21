const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const clear = require('clear');
const chalk = require('chalk');
const { clone } = require('./download');
const { spawn } = require('child_process');
const log = content => console.log(chalk.green(content));

// 让spawn更强大 promise化
const promisefySpawn = async (...args) => {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(...args);
        // 子进程的输出merge到主进程
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        childProcess.on('close', () => {
            resolve();
        })
    });
}



module.exports = async name => {
    clear();
    const data = await figlet('hello xcli'); // 添加横幅
    log(data);
    log('🚀创建项目', name);
    await clone('direct:https://github.com/LaughSun0513/first-cli.git');

    log('-------🚀安装依赖----------');
    await promisefySpawn('npm', ['install'], { cwd: `./temp/cli-1` });
    await promisefySpawn('npm', ['install'], { cwd: `./temp/cli-2` });
    await promisefySpawn('npm', ['install'], {cwd: `./temp/cli-3`});
    log('🚀安装完了')
}