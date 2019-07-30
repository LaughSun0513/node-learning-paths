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
        // if(author && keyword){
        //   // const resData = getList(author,keyword);
        //   // return new SuccessModel(resData);
        //   return getList(author,keyword).then(resData=>{
        //     return new SuccessModel(resData);
        //   })
        // }else {
        //   return new ErrorModel('获取博客列表失败，请传正确的参数 author & keyword');
        // }
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
        req.body.author = "zhangsan" ; //假数据，TODO：登录注册
        return newBlog(req.body).then(resData=>{
          return new SuccessModel(resData);
        });
    }
    //更新一篇博客   /api/blog/update  
    if( method==="POST" && path === "/api/blog/update"){
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
      req.body.author = "zhangsan" ; //假数据，TODO：登录注册
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
