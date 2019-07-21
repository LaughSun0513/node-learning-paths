const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controllers/blog')
const { SuccessModel,ErrorModel }  = require('../models')
const handleBlogRouter = (req,res) =>{
    const method = req.method;
    const path = req.path;
    const query = req.query;
    const id = query && query.id;
   

    //获取博客列表  /api/blog/list
    if( method==="GET" && path === "/api/blog/list"){
        const { author , keyword } = query;
        if(author && keyword){
          const resData = getList(author,keyword);
          return new SuccessModel(resData);
        }else {
          return new ErrorModel('获取博客列表失败，请传正确的参数 author & keyword');
        }
        
    }
    //获取一篇博客的内容  /api/blog/detail
    if( method==="GET" && path === "/api/blog/detail"){
        if(id){
          const resData = getDetail(id);
          return new SuccessModel(resData);
        }else{
          return new ErrorModel('获取博客内容失败，请传正确的参数id');
        }
    }
    //新增一篇博客   /api/blog/new 
    if( method==="POST" && path === "/api/blog/new"){
        const resData = newBlog(req.body);
        return new SuccessModel(resData);
    }
    //更新一篇博客   /api/blog/update  
    if( method==="POST" && path === "/api/blog/update"){
      const resData = updateBlog(id,req.body);
      if(resData){
        return new SuccessModel('更新博客成功');
      }else {
        return new ErrorModel('更新博客失败')
      }
    }
    //删除一篇博客   /api/blog/del   
    if( method==="POST" && path === "/api/blog/del"){
      if(id){
        const resData = delBlog(id);
        if(resData){
          return new SuccessModel('删除博客成功');
        }
      }
    }
}
module.exports = handleBlogRouter;
