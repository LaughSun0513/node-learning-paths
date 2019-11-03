var express = require('express');
var router = express.Router();
const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models');

router.post('/login', function(req, res, next) {
  const { username,password } = req.body;
  return loginCheck(username,password).then(loginRes => {
   if(loginRes.username){
     req.session.username = loginRes.username;
     req.session.realname = loginRes.realname;
   
     res.json(new SuccessModel('登陆成功!'));
     return;
    }
    res.json(new ErrorModel('登录失败!'));
  });
});

router.get('/login-get', function(req, res, next) {
  const { username,password } = req.query;
  return loginCheck(username,password).then(loginRes => {
   if(loginRes.username){
     req.session.username = loginRes.username;
     req.session.realname = loginRes.realname;
   
     res.json(new SuccessModel('登陆成功!'));
     return;
    }
    res.json(new ErrorModel('登录失败!'));
  });
});
/** 测试/login是否成功
 * http://localhost:3000/api/user/login-get?username=zhangsan&password=123 这里用get模拟post登录
 * http://localhost:3000/api/user/login-test 测试是否已登录
 */
router.get('/login-test',(req,res,next)=>{
  const session = req.session;
  if(session.username){
    res.json({
      res:'已登录'
    })
    return
  }
  res.json({
    res:'登录失败'
  })
});

/** 测试session是否成功
 * http://localhost:3000/api/user/session-test 
 */
router.get('/session-test',(req,res,next)=>{
    const session = req.session;
    if(!session.vieNum){
      session.vieNum = 0
    }
    session.vieNum ++;
    res.json({
      vieNum:session.vieNum
    })
});
module.exports = router;
