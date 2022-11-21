const mysql = require('mysql');
const { MYSQL_CONF }  = require('./conf');

const connection  = mysql.createConnection(MYSQL_CONF);

connection.connect();

//统一执行sql函数
function doSQL(sql){
  const promise = new Promise((resolve,reject)=>{
    connection.query(sql,(err,res)=>{
      if(err) reject(err); 
      resolve(res);
    })
  });
  return promise;
}
module.exports = {
    doSQL,
    escape:mysql.escape
}