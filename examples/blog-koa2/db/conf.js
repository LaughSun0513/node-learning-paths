const env = process.env.NODE_ENV //环境参数

//配置
let MYSQL_CONF;
let REDIS_CONF;

if ( env === 'dev' ) {
  MYSQL_CONF = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"yxy12345",
    database:"myBlogs"
  }
  REDIS_CONF = {
    host:'127.0.0.1',
    port:6379
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
  REDIS_CONF = {
    host:'127.0.0.1',
    port:6379
  }
}
module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}