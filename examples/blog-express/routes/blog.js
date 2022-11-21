var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controllers/blog');
const { SuccessModel,ErrorModel }  = require('../models');
const loginCheckResFunc = require('../middleware/loginCheck');

router.get('/list', function(req, res, next) {
    let { author , keyword , isadmin} = req.query;
    if(isadmin){
      if(req.session.username == null){
        res.json(new ErrorModel('未登录'));
        return;
      }
      //强行查询自己的博客
      author = req.session.username;
    }
    return getList(author,keyword).then(resData=>{
        res.json(new SuccessModel(resData));
    })
});
router.get('/detail', function(req, res, next) {
    const id = req.query.id;
    if(id){
      return getDetail(id).then(resData=>{
        res.json(new SuccessModel(resData));
      })
    }
});
router.post('/new',loginCheckResFunc, function(req, res, next) {
      req.body.author = req.session.username;
      return newBlog(req.body).then(resData=>{
        res.json(new SuccessModel(resData));
      });
});
router.post('/update',loginCheckResFunc, function(req, res, next) {
    const id = req.query.id;
    return updateBlog(id,req.body).then(resData=>{
      if(resData){
        res.json(new SuccessModel('更新博客成功'));
      }else {
        res.json(new ErrorModel('更新博客失败'));
      }
    });
});
router.post('/del',loginCheckResFunc, function(req, res, next) {
  const id = req.query.id;
  req.body.author = req.session.username;
  return delBlog(id,req.body.author).then(resData=>{
    if(resData){
      res.json(new SuccessModel('删除博客成功'));
    }else{
      res.json(new ErrorModel('删除博客失败'));
    }
  });
});
module.exports = router;
