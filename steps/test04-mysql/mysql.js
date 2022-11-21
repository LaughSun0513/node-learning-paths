const mysql = require("mysql");

const connection = mysql.createConnection({
  host:'localhost',
  port:'3306',
  user:'root',
  password:'yxy12345',
  database:'myBlogs'
});

//开始链接
connection.connect();

//执行sql语句
const SQL = 'select * from users;'
connection.query(SQL,(err,results)=>{
  if (err) console.error(err);
  console.log(results);
})

//关闭
connection.end()