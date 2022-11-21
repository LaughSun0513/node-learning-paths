const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controllers/blog');
const { SuccessModel,ErrorModel }  = require('../models');

// 统一登录验证函数
const loginCheck = (req) => {
    if(!req.session.username){
        return Promise.resolve(
          new ErrorModel('尚未登录')
        )
    }
}
//验证是否登录
const loginCheckResFunc = (req) => {
    const loginCheckRes = loginCheck(req);
    if(loginCheckRes){
      return loginCheckRes;
    }
}
const handleBlogRouter = (req,res) =>{
    const method = req.method;
    const path = req.path;
    const query = req.query;
    const id = query && query.id;
   

    //获取博客列表  /api/blog/list
    if( method==="GET" && path === "/api/blog/list"){
        let { author , keyword , isadmin} = query;
        if(isadmin){
          loginCheckResFunc(req);
          //强行查询自己的博客
          author = req.session.username;
        }
        return getList(author,keyword).then(resData=>{
          return new SuccessModel(resData);
        })
        
    }
    //获取一篇博客的内容  /api/blog/detail
    if( method==="GET" && path === "/api/blog/detail"){
        if(id){
          return getDetail(id).then(resData=>{
            return new SuccessModel(resData);
          })
        }
    }
    //新增一篇博客   /api/blog/new 
    if( method==="POST" && path === "/api/blog/new"){
        loginCheckResFunc(req);
        req.body.author = req.session.username;
        return newBlog(req.body).then(resData=>{
          return new SuccessModel(resData);
        });
    }
    //更新一篇博客   /api/blog/update  
    if( method==="POST" && path === "/api/blog/update"){
      loginCheckResFunc(req);
       return updateBlog(id,req.body).then(resData=>{
          if(resData){
            return new SuccessModel('更新博客成功');
          }else {
            return new ErrorModel('更新博客失败')
          }
       });
    }
    //删除一篇博客   /api/blog/del   
    if( method==="POST" && path === "/api/blog/del"){
      loginCheckResFunc(req);
      req.body.author = req.session.username;
      return delBlog(id,req.body.author).then(resData=>{
        if(resData){
          return new SuccessModel('删除博客成功');
        }else{
          return new ErrorModel('删除博客失败');
        }
      });
      
    }
}
module.exports = handleBlogRouter;
