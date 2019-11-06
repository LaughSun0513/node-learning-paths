const router = require('koa-router')()

router.prefix('/api/user')
const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models');

/**用户登录验证  /api/user/login
   * http://localhost:8000/api/user/login
   * 
   {
	  "username":"zhangsan",
	  "password":"123"
   }
   */
router.post('/login', async (ctx, next)=>{
  const { username,password } = ctx.request.body;
  const loginRes = await loginCheck(username,password);
  if(loginRes.username){
    ctx.session.username = loginRes.username;
    ctx.session.realname = loginRes.realname;
    ctx.body = new SuccessModel('登陆成功!')
    return;
   }
   ctx.body = new ErrorModel('登录失败!')
});
//-----------以下为测试代码------------
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