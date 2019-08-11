const queryString = require('querystring');
const handleBlogRouter= require('./routers/blog');
const handleUserRouter = require('./routers/user');
const { redisSet, redisGet } = require('./db/redis');

//const SESSION_DATA = {}; //存储session
//设置cookie过期时间 GMT格式
const setCookieExpires = () => {
  const date = new Date();
  date.setTime(date.getTime() + (24*60*60*1000));
  return date.toGMTString();
}

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

    //解析query
    req.query = queryString.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2;
    cookieStr.split(';').forEach(item=>{
        if(!item) return;

        const arr = item.split('=');
        const key = arr[0].trim() || "";
        const value = arr[1].trim() || "";
        req.cookie[key] = value;
    })
    console.log('req.cookie',req.cookie);

    //根据cookie解析session
    /*let userId = req.cookie.userid;
    let needSetCookie = false;
    if(userId){ //判断是否已经有userId,来决定是否是同一个用户 或是 在前端种一个自己能识别的userid
      if(!SESSION_DATA[userId]){ //表示有userid，但是没有找到对应的username等数据,清空存储当前userid用户的对象
        SESSION_DATA[userId] = {};
      } 
    } else { //在前端种一个自己能识别的userid
      needSetCookie = true;
      userId = `${Date.now()}_${Math.random()}`;
      SESSION_DATA[userId] = {};
    }*/
    /** 
     * 存储当前用户的userId  数据结构是 
     * SESSION_DATA = {
     *    1:{username:xxx,relaname:xxx},
     *    2:{username:xxx,relaname:xxx},
     *    '1565508588565_0.41190501274115565': { username: 'zhangsan', realname: '张三' } 
     * }
    */
    // req.session = SESSION_DATA[userId]; 
    // console.log('SESSION_DATA',SESSION_DATA);
    
    //将session存储到redis中
    let userId = req.cookie.userid;
    let needSetCookie = false;
    if(!userId){
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        redisSet(userId,{});
    }
    // 获取当前userid对应的username，relaname
    req.sessionId = userId;
    redisGet(req.sessionId).then(sessionData => {
        if(sessionData == null){
          redisSet(req.sessionId,{});
          req.session = {};
        } else {
          req.session = sessionData;
        }

        //解析post数据 返回promise
        return getPostData(req);
    })
    .then(postData => {
        req.body = postData;
        //处理博客的路由
        // const blogData = handleBlogRouter(req,res);
        // if(blogData){
        //   res.end(JSON.stringify(blogData));
        // }
        const blogRes = handleBlogRouter(req,res);
        if(blogRes){
          blogRes.then(blogData=>{
            if(needSetCookie){
              res.setHeader('Set-Cookie',`userid=${userId};path=/; httpOnly; expires=${setCookieExpires()}`);
            }
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
            if(needSetCookie){
              res.setHeader('Set-Cookie',`userid=${userId};path=/; httpOnly; expires=${setCookieExpires()}`);
            }
            res.end(JSON.stringify(userData));
          });
          return;
        }
    })
    
    
}

module.exports = serverHandle;