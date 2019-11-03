var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

var app = express();

const ENV = process.env.NODE_ENV
if(ENV !== 'production'){
  // 解析开发环境 日志
  app.use(logger('dev')); 
  // GET /api/blog/list 304 10.089 ms - - 日志格式
}else{
  // 解析线上环境 日志
  const logFile = path.join(__dirname,'./logs/access.log');
  const writeStream = fs.createWriteStream(logFile,{
    flags:'a'
  });
  app.use(logger('combined',{
    stream:writeStream
  })); 
  //::1 - - [03/Nov/2019:11:18:04 +0000] "GET /api/blog/list HTTP/1.1" 304 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36"
}

app.use(express.json()); // 解析json格式
app.use(express.urlencoded({extended: false})); // 解析非json格式，如form
app.use(cookieParser());

const redisClient = require('./db/redis');
const sessionStore = new RedisStore({
  client:redisClient
})
app.use(session({
  secret: 'AAAbbb_123##',
  cookie: {
    path: '/', //默认
    httpOnly: true,//默认
    maxAge: 24 * 60 * 60 * 100
  },
  store:sessionStore
}))

app.use('/api/user', userRouter);
app.use('/api/blog', blogRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;