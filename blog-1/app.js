const handleBlogRouter= require('./routers/blog');
const handleUserRouter = require('./routers/user');

const serverHandle = (req,res) => {
    //设置返回的JSON
    res.setHeader('Content-type','application/json');
    const blogData = handleBlogRouter(req,res);
    if(blogData){
      res.end(JSON.stringify(blogData));
    }

    const userData = handleUserRouter(req,res);
    if(userData){
      res.end(JSON.stringify(userData));
    }
    
}

module.exports = serverHandle;