const { promisify } = require('util');
const download = promisify(require('download-git-repo'));
const ora = require('ora');

module.exports.clone = async (repo,) => {
    const loading = ora('下载中', repo);
    loading.start();
    await download(repo, 'temp/', { clone: true });
    loading.succeed();
}