const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models')
const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="POST" && path === "/api/user/login"){
     const { username,password } = req.body;
     return loginCheck(username,password).then(loginRes => {
      if(loginRes.username){
        return new SuccessModel('登陆成功!');
       }
       return new ErrorModel('登录失败!');
     });
  }
  
}
module.exports = handleUserRouter;
