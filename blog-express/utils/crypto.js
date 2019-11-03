const crypto = require('crypto');

// 密钥
const SELECT_KEY = 'AbcD_123123##';

// md5 加密
function md5(content){
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex'); //以十六进制输出
}
// 加密函数
function md5PassWord(password){
  const str = `password=${password}&key=${SELECT_KEY}`;
  return md5(str);
}
// const res = md5PassWord('123');
// console.log(res);

module.exports = {
  md5PassWord
}