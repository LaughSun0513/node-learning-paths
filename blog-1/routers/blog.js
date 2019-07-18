const {
  getList,
  getDetail
} = require('../controllers')
const { SuccessModel,ErrorModel }  = require('../models')
const handleBlogRouter = (req,res) =>{
    const method = req.method;
    const path = req.url.split('?')[0];
    const query = req.url.split('?')[1];

    //获取博客列表  /api/blog/list
    if( method==="GET" && path === "/api/blog/list"){
        const { author , keyword } = query;
        const resData = getList(author,keyword);
        return new SuccessModel(resData);
    }
    //获取一篇博客的内容  /api/blog/detail
    if( method==="GET" && path === "/api/blog/detail"){
        const { id } = query;
        const resData = getDetail(id);
        return new SuccessModel(resData);
    }
    //新增一篇博客   /api/blog/new 
    if( method==="POST" && path === "/api/blog/new"){
        return {
          msg:'/api/blog/new'
        }
    }
    //更新一篇博客   /api/blog/update  
    if( method==="POST" && path === "/api/blog/update"){
      return {
        msg:'/api/blog/update'
      }
    }
    //删除一篇博客   /api/blog/del   
    if( method==="POST" && path === "/api/blog/update"){
      return {
        msg:'/api/blog/update'
      }
    }
}
module.exports = handleBlogRouter;
