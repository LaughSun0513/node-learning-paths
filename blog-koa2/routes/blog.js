const router = require('koa-router')()

router.prefix('/api/blog')
router.get('/list', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})


module.exports = router
