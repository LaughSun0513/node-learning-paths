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

router.get('/list', function(req, res, next) {
      let { author , keyword , isadmin} = req.query;
      // if(isadmin){
      //   // loginCheckResFunc(req);
      //   //强行查询自己的博客
      //   author = req.session.username;
      // }
      return getList(author,keyword).then(resData=>{
          res.json(new SuccessModel(resData));
      })
});

module.exports = router;
