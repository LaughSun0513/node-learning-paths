# Node-Blog
Node + Express/Koa2 + PM2 +Redis 

# Nodejs真正用途
- Nodejs，一个js运行环境
- 运行在服务端，作为web server
- 运行在本地，作为打包，构建工具

# 学习目标 -- 个人博客系统
# 学习内容
- API
- 数据存储
- 登录
- 日志
- 安全

# 技术
- HTTP
- Stream
- Session
- MySQL/Redis
- Nginx
- PM2

# 知识点介绍
## 课程准备
- Node介绍 --- Node安装 Node和js区别
- 服务端特点--- 服务端特点 服务端和前端的区别
- 案例分析和设计--- 博客项目的需求分析和技术方案设计
---------
  1. 使用原生代码开发案例项目
   * 实现API和数据存储，使用MySQL数据库
   * 从0实现登录，并使用redis存储登录信息
   * 安全，日志记录和日志分析
  -----------
  2. 使用框架开发案例项目
   * 分别使用express 和Koa2
   * 中间件机制
   * 常用插件
   * 中间件原理
  -------
  3. 线上环境
   * PM2介绍和配置
   * PM2多进程模型
   * 关于服务器运维
  -------
## 原生代码
- API和数据存储
- 登录和Redis
- 安全和日志

## 使用框架
- Express 和 Koa2
- 中间件和插件
- 中间件原理

## 线上环境
- PM2介绍和配置
- PM2多进程模型
- 服务器运维

------------
# Node介绍
## 下载和安装
1.普通方式  nodejs.cn 官网
2.NVM  node版本管理工具
  Mac `brew install nvm`
  Window github搜nvm-windows

```
nvm list # 查看当前所有的node版本
nvm install v10.15.0 # 安装制定版本
nvm use --delete-prefix 10.13.0 # 切换到指定版本
```

  
## Node和前端js区别
- ESMAScript -- 语法规范
  >定义了语法 ，写js的node必须遵守
  变量定义，循环，判断，函数
  原型和原型链、作用域和闭包、异步
  不能操作DOM，不能监听click时间，不能发送ajax请求
  不能处理http请求，不能操作文件
  只有ESMAScript，无法做项目

- Javascript
  >使用ESMAScript语法规范，外加Web API，缺一不可（ESMAScript + Web API）
  DOM操作，BOM，事件，Ajax...
  两者结合，即可完成浏览器端的操作

- NodeJs
  >使用ESMAScript语法规范，外加Node API，缺一不可（ESMAScript + Node API）
  处理http，处理文件等API 
  两者结合，即可完成server端的操作

- 补充:Commonjs & Node debugger
- Commonjs
```
# 导出
  module.exports = 变量
  module.exports = 对象

# 引入1
  const {a,b} = require('./a); //解构引入

# 引入2
  const opt = require('./a);
  const a = opt.a
  const b = opt.b
```

- Node bugger
 利用vscode自带的debugger功能，会根据`package.json` 里的 `main`字段去找入口


## server开发和前端开发的区别
### 服务稳定性
  - server 端可能会遭受各种恶意攻击和误操作
  - 单个客户端可以意外挂掉，但是服务端不能
  - 可以使用PM2做进程守护

### 考虑内存和CPU（优化和扩展）
- 日志记录
- 安全
- 集群和服务拆分

--------
# 项目
## 目标
- 开发博客系统，具有博客的基本功能
- 之开发server端，不关心前端

## 需求
- 首页、作者主页、博客详情页
- 登陆页
- 管理中心、新建页、编辑页

## 技术方案
### 1. 数据如何存储
- 博客

id | title |  content| createtime | author
---|:-----:|:-------:|:----------:|:----:|
1  | 标题1 | 博客1 | 创建时间xxx-xxx-xxx | xxx
2  | 标题2 | 博客2 | 创建时间xxx-xxx-xxx2 | xxx2

- 用户

id | username |  password | realname | 
---|:--------:|:---------:|:--------:|
1  | zhangsan | 123       | 张三 
2  | lisi     | 456 | 李四 

### 2. 如何与前端对接，即接口设计

描述             |     接口              |  方法      | url参数   | 备注
----------------|:---------------------:|:---------:|:--------:|:---------------:|
获取博客列表      | /api/blog/list        |   get     | author作者，keyword搜索关键字 |参数为空，则不进行查询过滤
获取一篇博客的内容 | /api/blog/detail      |   get     | id  |                  
新增一篇博客      | /api/blog/new         |   post    |     | post中有新增的信息
更新一篇博客      | /api/blog/update      |   post    | id  | postData中有更新的内容
删除一篇博客      | /api/blog/del         |   post    | id  | 
登录             | /api/user/login       |   post    |     | postData中有用户名和密码

### 3. 关于登录
- 业界有统一的解决方案，一般不用再重新设计


# 开发接口
## nodejs处理http请求
 ### DNS解析 建立TCP连接 发送http请求
    - 域名 -- > ip+port

 ### server接收到http请求，处理，并返回
 #### get 请求和querystring
  - get请求，即客户端要向server端获取数据，如查询博客列表
  - 通过querystring传递数据，如 a.html?a=100&b=200

  ```js
    const http = require('http');
    const querystring = require('querystring');

    const server = http.createServer((req,res)=>{
        console.log(req.method)
        const url = req.url;
        console.log(url);

        const queryStr = url.split('?')[1]; //根据问号拆分参数
        req.query = querystring.parse(queryStr);
        res.end(JSON.stringify(req.query));
    });
    server.listen(8000);
  ```

 #### post 请求和postdata（post发送的数据）
    - 客户端向服务端传递数据，如新建博客
    - 通过post data传递数据
    - 浏览器无法直接模拟，需要手写js，或者使用postman
    
  ```js
    const http = require('http');
    const log = console.log;

    const server = http.createServer((req,res)=>{
        if(req.method ==="POST"){
          // req 数据格式
          log('req content-type',req.headers['content-type']);

          // 接收数据
          let postData = '';
          req.on('data',chunk=>{
            postData += chunk.toString();
          });
          req.on('end',()=>{
            log('postData',postData);
            res.end('hello post')
          })
        }
    });
    server.listen(8001);
  ```
   ##### postman模拟发送post请求
   1.Chrome上安装postman插件
   2.地址栏输入访问地址 http://localhost:8001，修改请求为POST
   3.点击下方 “Body” ---> raw 右侧选择 JSON ---> 下方空白区 输入请求参数json
 
 #### 路由
  ```text
    解析req.url 里的/username /password等
  ```
 #### 综合示例
  ```js
    const http = require('http');
    const querystring = require('querystring');
    const log = console.log;

    const server = http.createServer((req,res)=>{
        const method = req.method;
        const url = req.url;
        const query = querystring.parse(url.split('?')[1]);
        const path = url.split('?')[0]

        res.setHeader('Content-type','application/json');

        const resData = {
          method,
          url,
          query,
          path
        }
        if(method==='GET'){
          res.end(JSON.stringify(resData))
        }
        if(method==='POST'){
          let postData = '';
          req.on('data',chunk => {
            postData += chunk
          });
          req.on('end',()=>{
            log('postData',postData);
            resData.postData = postData
            res.end(JSON.stringify(resData));
          })
        }
    });
    server.listen(8002);
  ```
### 客户端接收到返回数据，处理数据（如渲染页面，执行js）

## 搭建开发环境
  - 从0开始搭建，不使用任何框架
  - 使用nodemon监测文件变化，自动重启node
  - 使用cross-env 设置环境变量，兼容mac/linux/windows

## 开发接口，暂不考虑连接数据库和登录
 - 初始化路由：根据之前技术方案的设计，做出路由
 - 返回假数据：将路由和数据分离，以符合设计原则

├── app.js <br>    -- 主要服务
├── bin<br>
│   └── www.js<br>  --- 创建服务
├── controllers<br> --- 放假数据
│   └── index.js<br>
├── models<br>     --- 返回正确/错误 统一数据格式Model
│   └── index.js<br>
├── package-lock.json<br>
├── package.json<br>
└── routers<br>  -- 路由文件，解析请求
    ├── blog.js<br>
    └── user.js<br>

```js
# blog.js
const handleBlogRouter = (req,res) =>{
    const method = req.method;
    const path = req.url.split('?')[0];
  
    //获取博客列表  /api/blog/list
    if( method==="GET" && path === "/api/blog/list"){
        return {
          msg:'/api/blog/list'
        }
    }
    //获取一篇博客的内容  /api/blog/detail
    if( method==="GET" && path === "/api/blog/detail"){
        return {
          msg:'/api/blog/detail'
        }
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
```
```js
# user.js
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
```
```js
# app.js
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
```
-----------
### 解析post请求的接口 和 了解 callback/promise/async&await
```js
# app.js
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
        const blogData = handleBlogRouter(req,res);
        if(blogData){
          res.end(JSON.stringify(blogData));
        }

        //处理用户登录的路由
        const userData = handleUserRouter(req,res);
        if(userData){
          res.end(JSON.stringify(userData));
        }
    })
    
    
}

module.exports = serverHandle;
```
```js
# 建立返回的数据格式Model models/index.js
class BaseModel {
    constructor(data,message){
      if(typeof data === "string"){
          this.message = data;
          data = null;
          message = null
      }
      if(data){
        this.data = data;
      }
      if(message){
        this.message = message;
      }
    }
}

class SuccessModel extends BaseModel {
    constructor(data,message){
      super(data,message);
      this.errno = 0;
    }
}
class ErrorModel extends BaseModel {
  constructor(data,message){
    super(data,message);
    this.errno = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}
```
```js
# 解析 博客路由 routers/blog.js
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
```
```js
# 解析用户登录路由 routers/user.js
const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models')
const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="POST" && path === "/api/user/login"){
     const { username,password } = req.body;
     const result = loginCheck(username,password);
     if(result){
      return new SuccessModel('登陆成功!');
     }
     return new ErrorModel('登录失败!');
  }
  
}
module.exports = handleUserRouter;
```
```js
# 处理数据 controllers/blog.js
const getList = (author,keyword) => {
    console.log(author,keyword)
    return [
      {
        id:1,
        title:'博文A',
        content:"内容A",
        author:"zhangsan"
      },
      {
        id:2,
        title:'博文B',
        content:"内容B",
        author:"lisi"
      }
    ]
}
const getDetail = (id) => {
  return {
        id:1,
        title:'博文A',
        content:"内容A",
        author:"zhangsan"
  }
}
const newBlog = (blogData = {}) => {
  return {
    id:3
  }
}
const updateBlog = (id,blogData = {}) => {
    // id 要更新的博客id
    // blogData 博客对象 包含title content对象
    console.log('update blog',id,blogData);
    return true;
}
const delBlog = (id) => {
  //id 要删除的博客id
   return true;
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
```
```js
# 处理数据 controllers/user.js
const loginCheck = (username,password) => {
  if(username === 'zhangsan' && password === '123'){
    return true;
  }
  return false;
}
module.exports = {
  loginCheck
}
```