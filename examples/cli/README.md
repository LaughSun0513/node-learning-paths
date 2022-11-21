### 自己实现一个脚手架工具
- 初始化一些工具包
- 封装命令
- 拉模板
- 安装依赖

```bash
mkdir xcli && cd xcli
npm init -y
npm i commander download-git-repo ora handlebars figlet clear chalk open -s
```

```js
// package.json
 {
   "bin": {
    "xcli": "./bin/index.js"
  },
 }
```
```bash
npm link
xcli
```

### 初始化命令
```js
#!/usr/bin/env node
console.log('cli');

const program = require('commander');

program.version(require('../package.json').version)
    .command('init <name>')
    .description('初始化项目')
    .action(name => {
        console.log(name)
    })
program.parse(process.argv);
```

```js
.action(name => {
        console.log(name);
        require('./init.js')(name);
    })
```

```js
// 拉模板
await clone('direct:https://github.com/LaughSun0513/first-cli.git');

// download.js
const { promisify } = require('util');
const download = promisify(require('download-git-repo'));
const ora = require('ora');

module.exports.clone = async (repo,) => {
    const loading = ora('下载中', repo);
    loading.start();
    await download(repo, 'temp/', { clone: true });
    loading.succeed();
}
```

```js
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

log('-------🚀安装依赖----------');
  await promisefySpawn('npm', ['install'], { cwd: `./temp/cli-1` });
  await promisefySpawn('npm', ['install'], { cwd: `./temp/cli-2` });
  await promisefySpawn('npm', ['install'], {cwd: `./temp/cli-3`});
log('🚀安装完了')
```