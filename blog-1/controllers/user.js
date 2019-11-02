const {
  doSQL,
  escape
} = require('../db/mysql');
const {
  md5PassWord
} = require('../utils/crypto');
/**
 * 用户登录注册
 * http://localhost:8000/api/user/login
 * 
  {
    "username":"lisi",
    "password":"45655"
  }
 */
const loginCheck = (username, password) => {
  username = escape(username);

  password = md5PassWord(password);
  password = escape(password);

  let sql = `select username,realname from users where username=${username} and password=${password};`

  return doSQL(sql).then(usersArr => {
    return usersArr[0] || {}
  })
}
module.exports = {
  loginCheck
}