const queryString = require('querystring');
const handleBlogRouter= require('./routers/blog');
const handleUserRouter = require('./routers/user');

//解析post data，返回promise对象
const getPostData = (req) => {
    const promise = new Promise((resolve,reject) => {
          if(req.method === "POST" && req.headers['content-type'] === 'application/json'){
            let postData = "";
            req.on('data',chunk => postData += chunk.toString());
            req.on("end",()=>{
              if(postData){
                resolve(JSON.parse(postData));
              }else{
                resolve({});
                return;
              }
            })
          }else{
            resolve({});
            return;
          }
    });
    return promise;
}

const serverHandle = (req,res) => {
    //设置返回的JSON
    res.setHeader('Content-type','application/json');
    //获取path
    const url = req.url;
    req.path = url.split('?')[0];
    req.query = queryString.parse(url.split('?')[1])

    //解析post数据
    getPostData(req).then(postData => {
        req.body = postData;
        //处理博客的路由
        // const blogData = handleBlogRouter(req,res);
        // if(blogData){
        //   res.end(JSON.stringify(blogData));
        // }
        const blogRes = handleBlogRouter(req,res);
        if(blogRes){
          blogRes.then(blogData=>{
            res.end(JSON.stringify(blogData));
          });
          return;
        }
        
        //处理用户登录的路由
        // const userData = handleUserRouter(req,res);
        // if(userData){
        //   res.end(JSON.stringify(userData));
        // }
        const userRes = handleUserRouter(req,res);
        if(userRes){
          userRes.then(userData=>{
            res.end(JSON.stringify(userData));
          });
          return;
        }
    })
    
    
}

module.exports = serverHandle;