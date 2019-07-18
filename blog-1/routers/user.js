const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.url.split('?')[0];

  //获取博客列表  /api/user/login
  if( method==="POST" && path === "/api/user/login"){
      return {
        "msg":"/api/user/login"
      }
  }
  
}
module.exports = handleUserRouter;
