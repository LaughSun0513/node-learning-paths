const router = require('koa-router')()
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controllers/blog');
const {
  SuccessModel,
  ErrorModel
} = require('../models');
const loginCheckResFunc = require('../middleware/loginCheck');

router.prefix('/api/blog');

router.get('/list', async (ctx, next) => {
  let {
    author,
    keyword,
    isadmin
  } = ctx.query;
  if (isadmin) {
    if (ctx.session.username == null) {
      ctx.body = new ErrorModel('未登录')
      return;
    }
    //强行查询自己的博客
    author = ctx.session.username;
  }
  const resData = await getList(author, keyword);
  ctx.body = new SuccessModel(resData);
});

router.get('/detail', async (ctx, next) => {
  const resData = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(resData);
});

router.post('/new', loginCheckResFunc, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username;
  const resData = await newBlog(body);
  ctx.body = new SuccessModel(resData);
});

router.post('/update', loginCheckResFunc, async (ctx, next) => {
  const resData = await updateBlog(ctx.query.id, ctx.request.body);
  if (resData) {
    ctx.body = new SuccessModel('更新博客成功')
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
});

router.post('/del', loginCheckResFunc, async (ctx, next) => {
  const resData = await delBlog(ctx.query.id, ctx.session.username);
  if (resData) {
    ctx.body = new SuccessModel('删除博客成功')
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
});
module.exports = router