const router = require('koa-router')()

router.prefix('/api/user')
router.post('/', async (ctx, next) => {
  ctx.body = {
    title: '123'
  }
})
router.get('/session-test', async (ctx, next) => {
  if (ctx.session.vieNum == null) {
    ctx.session.vieNum = 0
  }
  ctx.session.vieNum++;
  ctx.body = {
    vieNum: ctx.session.vieNum
  }
})
module.exports = router