const env = process.env.NODE_ENV //环境参数

//配置
let MYSQL_CONF

if ( env === 'dev' ) {
  MYSQL_CONF = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"yxy12345",
    database:"myBlogs"
  }
}

if ( env === 'production' ) {
  MYSQL_CONF = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"yxy12345",
    database:"myBlogs"
  }
}
module.exports = {
  MYSQL_CONF
}