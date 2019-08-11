const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models');
const { redisSet } = require('../db/redis');

const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="POST" && path === "/api/user/login"){
     const { username,password } = req.body;
     return loginCheck(username,password).then(loginRes => {
      if(loginRes.username){
        req.session.username = loginRes.username;
        req.session.realname = loginRes.realname;
        redisSet(req.sessionId,req.session);
        console.log('req.session is', req.session);
        return new SuccessModel('登陆成功!');
       }
       return new ErrorModel('登录失败!');
     });
  }
  //测试：通过session来登录验证
  // if( method==="GET" && path === "/api/user/login-test"){
  //   console.log('login-test,req.session==>',req.session);
  //   console.log('login-test,req.cookie==>',req.cookie);
  //   if(req.session.username){
  //       return Promise.resolve(
  //         new SuccessModel({
  //           session:req.session
  //         })
  //       );
  //    }
  //    return Promise.resolve(new ErrorModel('登录失败!'));
  // }
  
}
module.exports = handleUserRouter;
