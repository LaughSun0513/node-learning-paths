const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')

const logger = require('koa-logger')
const fs = require('fs');
const path = require('path');
const morgan = require('koa-morgan');

const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const {
  REDIS_CONF
} = require('./db/conf');

const user = require('./routes/user')
const blog = require('./routes/blog')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// view
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});
// use koa-mogran to save logs
const ENV = process.env.NODE_ENV
if (ENV !== 'production') { // 解析开发环境 日志 格式:GET /api/blog/list 200 8.058 ms - 343
  app.use(morgan('dev'));
} 
else { // 解析线上环境 日志
  const logFile = path.join(__dirname, './logs/access.log');
  const writeStream = fs.createWriteStream(logFile, {
    flags: 'a'
  });
  app.use(morgan('combined', {
    stream: writeStream
  }));
  // 最终线上的日志格式 ::1 - - [06/Nov/2019:13:29:19 +0000] "GET /api/blog/list HTTP/1.1" 200 343 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
}

// connect redis to save session info
app.keys = ['AAAbbb_123##'];
app.use(session({
  store: redisStore({
    // all: '127.0.0.1:6379' //本地写死
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  }),
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}))
// routes
app.use(user.routes(), user.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app