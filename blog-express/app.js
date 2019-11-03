var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

var app = express();

app.use(logger('dev')); // 解析日志
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