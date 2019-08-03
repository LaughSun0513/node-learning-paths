const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models');

//设置cookie过期时间 GMT格式
const setCookieExpires = () => {
    const date = new Date();
    date.setTime(date.getTime() + (24*60*60*1000));
    return date.toGMTString();
}

const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="GET" && path === "/api/user/login"){
    //  const { username,password } = req.body;
     const { username,password } = req.query;
     return loginCheck(username,password).then(loginRes => {
      if(loginRes.username){
        res.setHeader('Set-Cookie',`username=${loginRes.username};path=/; httpOnly; expires=${setCookieExpires()}`);
        return new SuccessModel('登陆成功!');
       }
       return new ErrorModel('登录失败!');
     });
  }
  //测试：通过cookie来登录验证
  if( method==="GET" && path === "/api/user/login-test"){
    if(req.cookie.username){
      return Promise.resolve(new SuccessModel({
        username:req.cookie.username
      }));
     }
     return Promise.resolve(new ErrorModel('登录失败!'));
  }
  
}
module.exports = handleUserRouter;
