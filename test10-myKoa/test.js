const Koa = require('./index');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  console.log('1.....第一层洋葱--开始...')
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('2.....第一层洋葱--结束...')
});

// x-response-time

app.use(async (ctx, next) => {
  console.log('3.......第二层洋葱--开始.')
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('4.....第二层洋葱--结束...')
});

// response

app.use(async ctx => {
  console.log('5.......第三层洋葱--开始')
  ctx.body = 'Hello World';
  console.log('6.......第三层洋葱--结束')
});

app.listen(3000);

/** koa -- 洋葱卷模型
1.....第一层洋葱--开始...
3.......第二层洋葱--开始.
5.......第三层洋葱--开始
6.......第三层洋葱--结束
4.....第二层洋葱--结束...
2.....第一层洋葱--结束...
 */