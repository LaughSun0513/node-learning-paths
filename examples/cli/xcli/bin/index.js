#!/usr/bin/env node
console.log('cli');

const program = require('commander');

program.version(require('../package.json').version)
    .command('init <name>')
    .description('初始化项目')
    .action(name => {
        console.log(name);
        require('./init.js')(name);
    })
program.parse(process.argv);