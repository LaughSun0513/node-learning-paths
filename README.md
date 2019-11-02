# Node-Blog
Node + Express/Koa2 + PM2 + MySQL/Redis 

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
    const querystring = require('querystring');##
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

├── app.js  -- 主要服务 <br>   
├── bin<br>
│   └── www.js --- 创建服务<br>  
├── controllers --- 放假数据<br> 
│   └── index.js<br>
├── models  --- 返回正确/错误 统一数据格式Model<br>     
│   └── index.js<br>
├── package-lock.json<br>
├── package.json<br>
└── routers -- 路由文件，解析请求<br>  
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

# MySQL
## mysql 介绍 安装 使用
- web server 中最流行的关系型数据库
- 轻量级，易学易用
- 安装mysql [mysql](https://dev.mysql.com/downloads/mysql/)
  执行安装--->记住root用户名的密码

- 安装mysql可视化工具 [workbench](https://dev.mysql.com/downloads/workbench/)

### 建库--->建表--->表操作
- 如何建库，建表
- 建表时常用的数据类型(int,bight,varchar,longtext)
- sql 语句实现增删改查

1. 建库 --> 创建myblog数据库 --> 执行show databases查询
2. 建表 <br>

> 创建blogs博客表

id | title |  content| createtime | author
---|:-----:|:-------:|:----------:|:----:|
1  | 标题1 | 博客1 | 创建时间xxx-xxx-xxx | xxx
2  | 标题2 | 博客2 | 创建时间xxx-xxx-xxx2 | xxx2

-------------------------blogs博客表结构设计<br>

column   |   datatype |  pk主键 | nn不为空 | AI自动增加 | Deafult
---|:--------:|:---------:|:--------:|:--------:|:--------:|
id       | int(整数类型) |  Y(不重复) | Y | Y (自增)
title    | varchar(50)(字符串) |     | Y | 
content  | longtext(20) |           | Y | 
createtime | bigint(20)(长整数) |           | Y | | 0 
author   |  varchar(50) |           | Y |

-------------------------
>创建users表

id | username |  password | realname | 
---|:--------:|:---------:|:--------:|
1  | zhangsan | 123       | 张三 
2  | lisi     | 456 | 李四 

------------------------users用户表结构设计<br>

column | datatype |  pk主键 | nn不为空 | AI自动增加
---|:--------:|:---------:|:--------:|:--------:|
id  | int(整数类型) |  Y(不重复)   | Y | Y (自增)
username  | varchar(20)(字符串) |    | Y | 
password  | varchar(20) |    | Y | 
realname  | varchar(10) |    | Y | 

3.操作表
```SQL
# 使用myblog库
use myblog; 

# 显示所有表
show tables; 
# 注释
-- show tables; 

# 增
insert into users (username,`password`,realname) values ('zhangsan','123','张三') # 向users表插入username,`password`关键词加反引号,realname

# 查
select * from users; # 查询users表的所有内容
select id,username from users; # 查询users表的id,username

## 条件查询 同时满足
select * from users where username='zhangsan' and `password`='123' 
## 条件查询 并集查询 满足其一的就显示
select * from users where username='zhangsan' or `password`='123'

## 模糊查询
select * from users where username like '%zhang%'; 

## 排序查询(正序)，模糊查询有1的结果按照id排序
select * from users where `password` like '%1%' order by id ;

## 排序查询(倒序)，模糊查询有1的结果按照id排序 
select * from users where `password` like '%1%' order by id desc; 

# 更新
update users set relname='李四2' where username='lisi'
## 如果触发MySQL安全机制，可以关闭,再执行更新语句
SET SQL_SAFE_UPDATES=0;

# 删除(一定带where条件)
delete from users where username="lisi";

## 通过字段来表示删除，而不是真实delete删除
select * from users where state='1';
-- select * from users where state<>'0';(另一种写法 <>0 表示不等于0)
update users set state='0' where username='lisi' # 设置state=0表示删除(软删除)

# 查看mysql版本号
select version();
```


## Nodejs连接MySQL
### API 连接 mysql---test04

```js
npm i mysql

const mysql = require('mysql');

//创建数据库对象
const connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'xxx',
    password:'xxx',
    database:'myblog'
});

//开始链接
connection.connect();

//执行sql语句
connection.query(sql语句,(err,results)=>{
    if (err) throw err;
    console.log(results)
})

//关闭
connection.end()
```
```
## 遇到的问题 -- 安装完无法连接mysql，错误信息
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

## 解决方法
mysql -u root -p #登录mysql
Enter password: 输入你当前的mysql密码

mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
mysql> FLUSH PRIVILEGES;
mysql> quit

重新连接node--node mysql.js
[ RowDataPacket { id: 1, username: 'zhangsan', password: '123', realname: '张三' },
  RowDataPacket { id: 2, username: 'lisi', password: '456', realname: '李四2' } ]
```
-------
### 项目里使用mysql创建API接口----数据获取和返回操作
```js
# 创建db/conf.js 利用process.env.NODE_ENV来区分线上和本地版本的数据库配置

const env = process.env.NODE_ENV //环境参数

//配置
let MYSQL_CONF

if ( env === 'dev' ) {
  MYSQL_CONF = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"xxx",
    database:"myBlogs"
  }
}

if ( env === 'production' ) {
  MYSQL_CONF = {
    host:"xxx.xxx.xxx.xxx",
    port:"3306",
    user:"root",
    password:"xxx",
    database:"myBlogs"
  }
}
module.exports = {
  MYSQL_CONF
}
```
```js
# 创建db/mysql.js  启动node和mysql建立连接 封装统一执行SQL的函数doSQL
const mysql = require('mysql');
const { MYSQL_CONF }  = require('./conf');

const connection  = mysql.createConnection(MYSQL_CONF);

connection.connect();

//统一执行sql函数
function doSQL(sql){
  const promise = new Promise((resolve,reject)=>{
    connection.query(sql,(err,res)=>{
      if(err) reject(err); 
      resolve(res);
    })
  });
  return promise;
}
module.exports = {
    doSQL
}
```
```js
# controllers/blogs.js 使用SQL等数据库操作，对假数据进行替换 --- 博客列表
const { doSQL } = require('../db/mysql');

/**
 * 获取博客列表数据 GET
 * http://localhost:8000/api/blog/list
 * http://localhost:8000/api/blog/list?author=zhangsan
 * http://localhost:8000/api/blog/list?author=zhangsan&keyword=A
 */
const getList = (author,keyword) => {
    console.log(author,keyword);
    let sql = `select * from blogs where 1=1`
    if(author){
      sql += ` and author='${author}'`
    }
    if(keyword){
      sql += ` and title like '%${keyword}%'` //注意and 前面的空格
    }
    sql += ` order by 'createtime' desc;` //注意order 前面的空格
    //返回promise
    return doSQL(sql);
}

/**
 * 根据id获取单个博客详情 GET
 * http://localhost:8000/api/blog/detail?id=1
 * http://localhost:8000/api/blog/detail?id=2
 */
const getDetail = (id) => {
  let sql = `select * from blogs where id=${id}`;
  return doSQL(sql);
}
/**
 * 创建新的博客内容 POST
 * http://localhost:8000/api/blog/new
 * body 内容
  {
	  "title":"博客xx",
	  "content":"内容xx"
  } 
 */
const newBlog = (blogData = {}) => {
  const { title,content,author} = blogData;
  let createtime = Date.now();
  let sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}');` //注意执行顺序

  return doSQL(sql).then(insertData=>{
    console.log('insertData==>',insertData);
    /*OkPacket {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 3,
      serverStatus: 2,
      warningCount: 0,
      message: '',
      protocol41: true,
      changedRows: 0 }*/
    return {
      id:insertData.insertId //通过insertId来判断是否加载成功
    }
  });
}
/**
 * 创建新的博客内容 POST
 * http://localhost:8000/api/blog/update?id=3
 * body 内容
  {
	  "title":"博客xxxx",
	  "content":"内容xxxxx"
  } 
 */
const updateBlog = (id,blogData = {}) => {
    // id 要更新的博客id
    // blogData 博客对象 包含title content对象
    console.log('update blog',id,blogData);
    const { title , content } = blogData;
    let sql = `update blogs set title='${title}', content='${content}' where id=${id};` //注意 ,空格 content='${content}'
    return doSQL(sql).then(updateRes=>{
      if(updateRes.affectedRows > 0){ //根据affectedRows>0来判断是否更新成功
        return true;
      }
      return false;
    })
}
/**
 * 创建新的博客内容 POST
 * http://localhost:8000/api/blog/del?id=3
 */
const delBlog = (id,author) => {
  //id 要删除的博客id
  let sql = `delete from blogs where id='${id}' and author='${author}';` //安全机制，保证作者一致
  return doSQL(sql).then(updateRes=>{
    if(updateRes.affectedRows > 0){ //根据affectedRows>0来判断是否删除成功
      return true;
    }
    return false;
  })
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
# controllers/user.js 使用SQL等数据库操作，对假数据进行替换 --- 用户列表
const { doSQL } = require('../db/mysql');
/**
 * 用户登录注册
 * http://localhost:8000/api/user/login
 * 
  {
    "username":"lisi",
    "password":"45655"
  }
 */
const loginCheck = (username,password) => {
  let sql = `select username,realname from users where username='${username}' and password='${password}';`

  return doSQL(sql).then(usersArr => {
      return usersArr[0] || {}
  })
}
module.exports = {
  loginCheck
}
```
```js
# routers/blogs 对数据进行路由返回处理 -- 博客列表
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
```
```js
# routers/users 对数据进行路由返回处理 -- 用户列表
const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models')
const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="POST" && path === "/api/user/login"){
     const { username,password } = req.body;
     return loginCheck(username,password).then(loginRes => {
      if(loginRes.username){
        return new SuccessModel('登陆成功!');
       }
       return new ErrorModel('登录失败!');
     });
  }
  
}
module.exports = handleUserRouter;
```
```js
# app.js 对结果进行前端返回
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
```
## 登录--- 核心:登录校验 & 登录信息存储

### cookie和session
#### cookie
1.什么是cookie
  - 存储在浏览器的一段字符串（最大5k）
  - 跨域不共享
  - 格式如：k1=v1;k2=v2;k3=v3; 可存储结构化数据
  - 每次发送http请求，会将请求域的cookie一起发送给server
  - server可以修改cookie并返回给浏览器
  - 浏览器中也可通过js修改cookie(限制)

2.js操作cookie，浏览器中查看cookie
  - 客户端查看cookie三种方式
    - Chrome控制台---> Network--->请求中的Request Header
    - Chrome控制台---> Application --> Storage -->Cookies
    - Chrome控制台---> Console --->输入 'document.cookie'(js查看)
  <br/>
  - js修改cookie(有限制)
    - document.cookie='k1=100;'
    - document.cookie='k2=100;'
    - cookie会累加--> 结果: document.cookie --> "k1=100;k2=100;"

3.server端操作cookie，实现登录验证
  - 查看cookie -- req.headers.cookie
  - 修改cookie -- res.setHeader('Set-Cookie',`key1=v1;key2=v2;path=/`)
  - 模拟实现登录验证
  原理：通过get请求输入账号和密码，第一次登陆完，server端在客户端种一个cookie，如果下次再登录，Request Header里会携带上次的cookie
```js
    //在serverHandle函数里 解析cookie
    req.cookie = {}; //挂载在req上
    const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2;
    cookieStr.split(';').forEach(item=>{
        let key = item.split('=')[0] || "";
        let value = item.split('=')[1] || "";
        req.cookie[key] = value;
    })
    console.log('req.cookie',req.cookie);
```
```js
const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models')
const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="GET" && path === "/api/user/login"){ //这里修改为GET来模拟
    //  const { username,password } = req.body;
     const { username,password } = req.query;
     return loginCheck(username,password).then(loginRes => {
      if(loginRes.username){
        res.setHeader('Set-Cookie',`username=${loginRes.username};path=/;`)
        return new SuccessModel('登陆成功!');
       }
       return new ErrorModel('登录失败!');
     });
  }
}
module.exports = handleUserRouter;
```
```
# test URL: http://localhost:8000/api/user/login?username=zhangsan&password=123
会在浏览器种一个cookie

Response Header:
Connection: keep-alive
Content-Length: 37
Content-type: application/json
Date: Tue, 30 Jul 2019 14:11:56 GMT
Set-Cookie: username=zhangsan;path=/; # 这个是服务端种上的

# 再次请求
Request Header:
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: max-age=0
Connection: keep-alive
Cookie: username=zhangsan  #这里会携带上次种上的的cookie
Host: localhost:8000
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36
```
4.cookie安全性
4.1 httpOnly
场景：对于登录的lisi，如果通过前端修改document.cookie="zhangsan"，会导致zhangsan的数据泄漏，为了防止这种情况，服务端需要进行安全限制，防止前端修改cookie 

```
# 设置httpOnly
 res.setHeader('Set-Cookie',`username=${loginRes.username};path=/; httpOnly`);
```
4.2 设置cookie过期时间
场景:对于长时间登录的状态，需要定时让用户登录，防止他人获取登录后的用户信息

```js
//设置cookie过期时间 GMT格式
const setCookieExpires = () => {
    const date = new Date();
    date.setTime(date.getTime() + (24*60*60*1000));
    return date.toGMTString();
}

res.setHeader('Set-Cookie',`username=${loginRes.username};path=/; httpOnly; expires=${setCookieExpires()}`);
```

##### cookie总结
- 知道cookie的定义和特点
- 前后端如何查看和修改cookie
- 如何使用cookie实现登录验证

### session
#### 为什么使用session --- cookie会暴露username，很危险
- 解决方案：cookie中存储userid，server端对应username，
- 原理 session，即server端存储用户信息，server端给客户端cookie种一个只有server端认识的userid，根据这个去验证username是否是一个人

##### 利用变量存储session数据，利用cookie来实现session--demo
```js
# 核心实现代码 代码不分文件和执行顺序
const SESSION_DATA = {}; //存储session

//根据cookie解析session
  let userId = req.cookie.userid;
  let needSetCookie = false;
  if(userId){ //判断是否已经有userId,来决定是否是同一个用户 或是 在前端种一个自己能识别的userid
    if(!SESSION_DATA[userId]){ //表示有userid，但是没有找到对应的username等数据,清空存储当前userid用户的对象
      SESSION_DATA[userId] = {};
    } 
  } else { //在前端种一个自己能识别的userid
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  /** 
   * 存储当前用户的userId  数据结构是 
   * SESSION_DATA = {
   *    1:{username:xxx,relaname:xxx},
   *    2:{username:xxx,relaname:xxx},
   *    '1565508588565_0.41190501274115565': { username: 'zhangsan', realname: '张三' } 
   * }
  */
  req.session = SESSION_DATA[userId]; 
  console.log('SESSION_DATA',SESSION_DATA);
  
  //根据变量里的userid来判断是否在前端种cookie
  if(needSetCookie){
      res.setHeader('Set-Cookie',`userid=${userId};path=/; httpOnly; expires=${setCookieExpires()}`);
  }
  //设置session，搜索数据库，将真实的用户名和userid对应
  if(loginRes.username){
        // res.setHeader('Set-Cookie',`username=${loginRes.username};path=/; httpOnly; expires=${setCookieExpires()}`);
        req.session.username = loginRes.username;
        req.session.realname = loginRes.realname;
        console.log('req.session is', req.session);
        return new SuccessModel('登陆成功!');
  }
```
```js
 # app.js完整代码
 const queryString = require('querystring');
const handleBlogRouter= require('./routers/blog');
const handleUserRouter = require('./routers/user');

const SESSION_DATA = {}; //存储session
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
    let userId = req.cookie.userid;
    let needSetCookie = false;
    if(userId){ //判断是否已经有userId,来决定是否是同一个用户 或是 在前端种一个自己能识别的userid
      if(!SESSION_DATA[userId]){ //表示有userid，但是没有找到对应的username等数据,清空存储当前userid用户的对象
        SESSION_DATA[userId] = {};
      } 
    } else { //在前端种一个自己能识别的userid
      needSetCookie = true;
      userId = `${Date.now()}_${Math.random()}`;
      SESSION_DATA[userId] = {};
    }
    /** 
     * 存储当前用户的userId  数据结构是 
     * SESSION_DATA = {
     *    1:{username:xxx,relaname:xxx},
     *    2:{username:xxx,relaname:xxx},
     *    '1565508588565_0.41190501274115565': { username: 'zhangsan', realname: '张三' } 
     * }
    */
    req.session = SESSION_DATA[userId]; 
    console.log('SESSION_DATA',SESSION_DATA);

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
```
```js
# user.js完整代码
const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models');

//设置cookie过期时间 GMT格式
const setCookieExpires = () => {
    const date = new Date();
    date.setTime(date.getTime() + (24*60*60*1000));
    return date.toGMTString();
}

const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="GET" && path === "/api/user/login"){
    //  const { username,password } = req.body;
     const { username,password } = req.query;
     return loginCheck(username,password).then(loginRes => {
      if(loginRes.username){
        // res.setHeader('Set-Cookie',`username=${loginRes.username};path=/; httpOnly; expires=${setCookieExpires()}`);
        req.session.username = loginRes.username;
        req.session.realname = loginRes.realname;
        console.log('req.session is', req.session);
        return new SuccessModel('登陆成功!');
       }
       return new ErrorModel('===>登录失败!');
     });
  }
  //测试：通过session来登录验证
  if( method==="GET" && path === "/api/user/login-test"){
    console.log('login-test,req.session==>',req.session);
    console.log('login-test,req.cookie==>',req.cookie);
    if(req.session.username){
        return Promise.resolve(
          new SuccessModel({
            session:req.session
          })
        );
     }
     return Promise.resolve(new ErrorModel('登录失败===>!'));
  }
  
}
module.exports = handleUserRouter;
```
#### session使用js变量来存储带来的问题 --- 解决方案：redis
目前session 直接是js变量，放在nodejs进程内存中(Node进程有限)

- 第一，进程内存有限，访问量过大，内存暴增怎么办？(用户访问如果增多)
- 第二，正式线上运行是多进程的，进程之间内存无法共享(当前用户1的数据存在进程1，但是如果下次访问用户1,进到里进程2，进程2不存在用户1的数据，就会导致进程2重复创建数据)

解决方案--redis
- web server最常用的缓存数据库，数据存储在内存中
- 相比于mysql，访问速度快(内存和硬盘数据库不是一个数量级)
- 但成本更高，可存储的数据量更小(内存的硬伤)
- 将web server和redis拆分成两个单独的服务(关键!!!)
- 双方都是独立的，都是可扩展的(例如 都扩展成集群)
- 包括mysql，也是一个单独的服务，也可扩展

为什么session适用redis？
- session访问频繁，对性能要求极高
- session可不考虑断电丢失数据的问题
- session数据量不会太大

为什么网站数据不适合用redis？
- 操作频率不是太高
- 断电不能丢失，必须保留
- 数据量太大，内存成本太高

##### 安装redis
[windows安装redis](https://www.runoob.com/redis/redis-install.html)
<br>
Mac安装 `brew install redis`

```SQL
# redis使用
redis-server #启动服务
redis-cli # 新建窗口

set key1 value1 # 设置key:value
get key1    # 获取key的值
keys *      # 获取所有key
del key1    # 删除当前key
```
##### Nodejs 启动Redis -- test05
`npm install redis --save`

```js
const redis = require('redis');

//创建客户端
const redisClient = redis.createClient(6379,'127.0.0.1');
redisClient.on('error',err=>{
    console.log(err);
});

//test-设置值，取值
redisClient.set('myname','zhangsan2',redis.print);
redisClient.get('myname',(err,val)=>{
    if(err){
      console.error(err);
      return;
    }
    console.log('val',val);
    redisClient.quit();
});

```
```
node index.js # 通过node连接redis 读写操作

Reply: OK
val zhangsan2

# redis客户端查看是否生成key
redis-cli
127.0.0.1:6379> keys *
1) "myname"
```

#### 使用redis替换session变量
```js
##### db/conf.js #####
let REDIS_CONF;

if ( env === 'dev' ) {
  REDIS_CONF = {
    host:'127.0.0.1',
    port:6379
  }
}

if ( env === 'production' ) {
  REDIS_CONF = {
    host:'127.0.0.1',
    port:6379
  }
}
module.exports = {
  REDIS_CONF
}

##### db/redis.js 封装get & set 方法 #####
const redis = require('redis');
const { REDIS_CONF } = require('./conf');
const { port , host } = REDIS_CONF;

//创建客户端
const redisClient = redis.createClient(port,host);

redisClient.on('error',err => {
    console.error(err);
});

//封装 redis set方法
function redisSet(key,val){
    if(typeof val === 'object'){
        val = JSON.stringify(val);
    }
    redisClient.set(key,val,redis.print);
}
//封装 redis get方法
function redisGet(key){
  const promise = new Promise((resolve,reject) =>{
    redisClient.get(key,(err,val) =>{
        if(err){
          reject(err);
          return;
        }
        if(val === null){
          resolve(null);
          return;
        }
        try {
          resolve(JSON.parse(val)); //try/catch 不是为了抓异常,而是兼容对象的值
        }catch(e){
          resolve(val);
        }
        
    });
  });
  return promise;
}
module.exports = {
  redisSet,
  redisGet
}

##### app.js #######
const { redisSet, redisGet } = require('./db/redis');
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
  });

##### routers/user.js #####
const { redisSet } = require('../db/redis');

req.session.username = loginRes.username;
req.session.realname = loginRes.realname;
redisSet(req.sessionId,req.session);
```
#### 完成blog的登录验证
```js
# router/blog.js
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controllers/blog');
const { SuccessModel,ErrorModel }  = require('../models');

// 新增：统一登录验证函数
const loginCheck = (req) => {
    if(!req.session.username){
        return Promise.resolve(
          new ErrorModel('尚未登录')
        )
    }
}
//新增：验证是否登录
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
        const { author , keyword } = query;
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
        loginCheckResFunc(req); //新增
        req.body.author = req.session.username; //新增，不再是假数据
        return newBlog(req.body).then(resData=>{
          return new SuccessModel(resData);
        });
    }
    //更新一篇博客   /api/blog/update  
    if( method==="POST" && path === "/api/blog/update"){
      loginCheckResFunc(req); //新增
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
      loginCheckResFunc(req); //新增
      req.body.author = req.session.username; //新增
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
```
```js
# routers/user.js
const { loginCheck } = require('../controllers/user');
const { SuccessModel,ErrorModel }  = require('../models');
const { redisSet } = require('../db/redis');

const handleUserRouter = (req,res) =>{
  const method = req.method;
  const path = req.path;

  //获取博客列表  /api/user/login
  if( method==="POST" && path === "/api/user/login"){
     const { username,password } = req.body;
     return loginCheck(username,password).then(loginRes => {
      if(loginRes.username){
        req.session.username = loginRes.username;
        req.session.realname = loginRes.realname;
        redisSet(req.sessionId,req.session);
        return new SuccessModel('登陆成功!');
       }
       return new ErrorModel('登录失败!');
     });
  }
}
module.exports = handleUserRouter;
```

### 开发登录功能，和前端联调（ngnix反向代理）
- 登录功能依赖cookie，必须用浏览器来联调
- cookie跨域不共享，前端和server端必须同域
- 需要用到nginx做代理，让前后端同域

#### 准备前端页面
- admin.html
- edit.html
- login.html
- detail.html
- index.html
- new.html

##### 创建静态页面服务-- http-server
`npm install http-server -g`
`http-server -p 8001` # 创建前端静态资源服务端口号为8001,可查看前端html文件

#### 前后端端口不一致--使用nginx
- 前端端口：8001
- 后端端口：8000

nginx介绍
- 高性能的web服务器，开源免费
- 一般用于做静态服务，负载均衡
- 反向代理
  - 正向代理:客户端控制的代理
  - 反向代理：对于客户端是一个黑盒的server端代理

nginx反向代理
- 浏览器---> localhost/index.html ---> nginx ---> / ---> html 
- 浏览器---> localhost/index.html ---> nginx ---> /api/... ---> nodejs

nginx下载
[Windows](http://nginx.org/en/download.html)<br>
Mac `brew install nginx`

nginx配置
Windows:C:\nginx\conf\nginx.conf
Mac:/usr/local/etc/nginx/nginx.conf

nginx命令
```js
nginx -t        # 测试配置文件格式是否正确 
nginx -s reload # 启动nginx 重启
nginx -s stop   # 停止
```

```js
# vim /usr/local/etc/nginx/nginx.conf

worker_processes 2; # 启动几个内核

location / {
  proxy_pass http://localhost:8001; 
}
location /api/ {
  proxy_pass http://localhost:8000;
  proxy_set_header Host $host;
}

# nginx -t 测试是否配置代理成功

nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful
```

### 登录功能-总结
- cookie是什么？ session是什么？如何实现登录？
- redis扮演什么角色？有什么核心价值？
- nginx的反向代理配置，联调过程中的作用？


### 日志
  - 系统没有日志，就等于人没有眼睛
    - 每日流量？ QPS多少(QPS:每秒访问量)？
  - 第一，访问日志 access log (server端最重要的日志)
    - 客户端信息,页面信息
    - GET/POST  请求
    - 浏览器信息,占比
  - 第二，自定义日志(包括自定义事件、错误记录等);
  - 怎么记录日志？
  - 怎么拆分日志？分析日志？

1.目录
 - Nodejs 文件操作 --- Stream 流(为了节省CPU内存)
    - 日志要存储到文件中    -- 需要拷贝到其他文件，减少操作成本
    - 为何不存储到mysql中？ -- 硬盘数据库，适合多表联动的查表操作场景
    - 为何不存储到redis中？ -- 内存数据库，成本太高，日志操作不频繁
 - 日志功能开发和使用
 - 日志文件拆分，日志内容分析

2.文件读写，是否存在
- fs.readFile
- fs.writeFile
- fs.exist

3.IO操作的性能瓶颈
- IO 包括"网络IO" 和 "文件IO"
- 相对于CPU计算和内存读写，IO的突出特点就是：慢！
- 如何在有限的硬件资源下提高IO的操作效率？

4.stream--解放CPU内存
- 标准输入输出，pipe就是管道（符合水流管道的模型图）
- process.stdin获取数据，直接通过管道传递给 process.stdout

```js
process.stdin.pipe(process.stdout)

node index.js

### 结果 输入123 回车就是对应的内容
123
123
231231231
231231231
```

- 文件IO操作
```js
# 将 1.txt文件内容 复制到 2.txt
const fs = require('fs');
const path = require('path');

const filename1 = path.resolve(__dirname,'./1.txt');
const filename2 = path.resolve(__dirname,'./2.txt');

const readStream = fs.createReadStream(filename1);
const writeStream = fs.createWriteStream(filename2);

//将文件1.txt的内容通过流的方式 复制到 2.txt
readStream.pipe(writeStream);

//监听变化
readStream.on('data',chunk => {
    console.log(chunk.toString());
});
readStream.on('end',() => {
  console.log('copy done');
});
```
- 网络IO操作
```js
# 网络IO操作,将1.txt文本内容通过流返回至客户端
const http = require('http');
const fs = require('fs');
const path = require('path');

//将文件1的内容通过stream输出返回至客户端 -- 1
const filename1 = path.resolve(__dirname,'./1.txt');

const server = http.createServer((req,res)=>{
  if(req.method === "GET"){
     const readStream = fs.createReadStream(filename1); //2
     readStream.pipe(res); //3
  } 
})
server.listen(8005);
```

#### 代码中记录访问日志
```js
# utils/log.js
const fs =require('fs');
const path = require('path');

//生成write stream
function createWriteStream(fileName){
     const fullFileName = path.resolve(__dirname,'./','../','logs',fileName);
     const writeStream = fs.createWriteStream(fullFileName,{
        flags:'a' //append 追加写日志
     });
     return writeStream;
}

const accessWriteStream = createWriteStream('access.log');

function writeLog(writeStream,log){
  writeStream.write(log + '\n'); //关键
}
function access(log){
  writeLog(accessWriteStream,log);
}

module.exports = {
  access
}

# 使用
const { access }  = require('./utils/log');
//记录 access log
access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`);
```

#### 日志拆分
- 日志内容会慢慢积累，放在一个文件中不好处理
- 按时间划分日志文件，如 2019-08-13.access.logs
- 实现方式: linux的crontab命令,即定时任务

##### crontab
- 设置定时任务 格式 *****command ==> 
minute/hour/day/month/week  command     顺序：分 时 日 月 周 shell脚本
例如 
```txt
5****command 表示 每5分钟执行该命令
*1***command 表示 每天的第1个小时执行该命令
**5**command 表示 每个月5号执行该命令
***5*command 表示 5月1号执行该命令
****5command 表示 每周5执行该命令
```

再比如
```txt
## 分钟 ##
* * * * * command        每1分钟执行一次command
3,15 * * * * command     每小时的第3和第15分钟执行

## 小时 ##
* */1 * * * /etc/init.d/smb restart 每一小时重启smb
* 23-7/1 * * * /etc/init.d/smb restart 晚上11点到早上7点之间，每隔一小时重启smb
30 21 * * * /etc/init.d/smb restart 每晚的21:30重启smb
0,30 18-23 * * * /etc/init.d/smb restart 每天18 : 00至23 : 00之间每隔30分钟重启smb
3,15 8-11 * * * command  在上午8点到11点的第3和第15分钟执行

## 日期 ## 
3,15 8-11 */2 * * command 每隔两天的上午8点到11点的第3和第15分钟执行
45 4 1,10,22 * * /etc/init.d/smb restart 每月1、10、22日的4 : 45重启smb

## 月份 ##
0 4 1 jan * /etc/init.d/smb restart 一月一号的4点重启smb

## 周 ##
3,15 8-11 * * 1 command  每个星期一的上午8点到11点的第3和第15分钟执行
10 1 * * 6,0 /etc/init.d/smb restart 每周六、周日的1:10重启smb 
0 11 4 * mon-wed /etc/init.d/smb restart 每月的4号与每周一到周三的11点重启smb
```

##### crontab命令和日志的运用场景
- 将access.log拷贝并重命名为2019-11-2.access.log
- 清空access.log文件，继续积累日志
```
#### 编写shell脚本 ####
#!/bin/sh
cd /Users/yuxiaoyang03/Desktop/learning/Node-Blog/blog-1/logs // 到log的目录下
cp access.log $(date +%Y-%m-%d).access.log  // 将access.log根据时间日期重命名
echo "" > access.log // 清空access.log
```

```
#### 设置定时任务 ####
crontab -e 

#### 编写定时任务 每天凌晨0点0分执行shell脚本 ####
* 0 * * * sh /Users/yuxiaoyang03/Desktop/learning/Node-Blog/blog-1/utils/copyLog.sh 

#### 查看已经设置的定时任务 ####
crontab -l 
```

#### 日志分析 -- readline
- 如针对access.log日志，分析Chrome的占比
- 日志是按行存储的，一行就是一条日志
- 使用Node的readline(基于stream，效率高)

```js
// readline使用步骤
const readline = require('readline');
const fileName = path.join(__dirname, '../logs/access.log'); //找要分析的日志
const readStream = fs.createReadStream(fileName); // 创建readstream
const rl = readline.createInterface({
  input: readStream
});// 创建readline对象
rl.on('line',()=>{});
rl.on('close',()=>{});
```

##### 代码
- 将 http://localhost:8000/api/blog/list 在Chrome/Safari/Firefox里面执行几遍在access.log里产生日志内容
- 创建 utils/readline.js

```js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 寻找目标日志文件
const fileName = path.join(__dirname, '../logs/access.log');

// 创建读取流 
const readStream = fs.createReadStream(fileName);

// 创建readline对象
const rl = readline.createInterface({
  input: readStream
});

// 计数器
let chromeNum = 0;
let sum = 0;

// 逐行读取
rl.on('line', (lineData) => {
  if (!lineData) {
    return;
  };
  sum++;

  // 获取Chrome浏览器的日志信息
  // GET -- /api/blog/list -- Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36 -- 1572693248592
  let logArr = lineData.split(' -- '); // 根据--日志格式拆分
  if (logArr[2] && logArr[2].indexOf('Chrome') > 0) {
    chromeNum++;
  }
});

rl.on('close', () => {
  let res = parseFloat(chromeNum / sum).toFixed(2) * 100 + "%";
  console.log('chrome浏览器占比:' + res);
});
```
- 执行 node ./utils/readline.js

#### 总结
- 日志对于server端很重要，就像眼睛
- IO性能瓶颈，使用stream提高性能
- 使用crontab拆分日志文件
- 使用readline分析日志内容

# 安全
- SQL注入:窃取数据库内容
- XSS攻击:窃取前端的cookie的内容
- 密码加密:保护用户信息安全(重要！！)

## SQL注入
- 最原始、最简单的攻击，从web2.0就有了
- 攻击方式:输入一个sql片段，最终拼接成一段攻击代码
- 预防措施:使用mysql的escape函数处理输入内容即可
```
# 正常的sql
select username,realname from users where username='zhangsan'and password='123';

# 如果在用户名处输入 “zhangsan' --” 就会导致sql注入
select username,realname from users where username='zhangsan' -- 'and password='123';

# 这样加上“'zhangsan;delete from users -- ”就完蛋了 users表就没了
select username,realname from users where username='zhangsan';delete from users -- 'and password='123';

# 防范 -- 利用mysql.escape()
username = mysql.escape(username)
password = mysql.escape(password)

## escape转义了符号 所以达到了防止sql注入的功能
select username,realname from users where username='zhangsan\' -- 'and password='123';
``` 

## XSS攻击
- 前端同学最熟悉的攻击方式，但server端更应该掌握
- 攻击方式:在页面展示内容中掺杂js代码，以获取网页信息
- 预防措施:转换生成js的特殊字符
```
// xss攻击 往文本框里输入js代码
<script>alert(document.cookie)</script>

// 转换特殊字符
& --> &amp;
< --> &it;
> --> &gt;
" --> &quot;
' --> &#x27;
/ --> &#x2F;

// 可以安装xss工具包
npm i xss --save
title = xss(title);
content = xss(content);
```

## 密码加密 -- crypto加密库
- 数据库被用户攻破，最不应该泄漏的就是用户信息
- 攻击方式:获取用户名和密码,再去尝试登录其他系统
- 预防措施:将密码加密，即便拿到密码也不显示明文

```
// 原理: 自定义的key + 密码 --> 加密的戳
let SELECT_KEY = 'AbcD_123123##';
let content = `password=${password}&key=${SELECT_KEY}`;
let md5Pass = crypto.createHash('md5').update(content).digest('hex'); //最终加密的密码

// 将zhangsan的密码更新为加密之后的'eb0c2f011e4adb48ad2802321a8c132f'
// 更换密码长度 右击users表 --> Alter Table --> VARCHAR(20) 改为 VARCHAR(32)
```

# 总结-- 不使用框架开发server的总结
- 开发了哪些功能模块，完整的流程
  - 功能模块
    - 处理http接口
    - 连接数据库
    - 实现登录
    - 安全
    - 日志
    - 上线
  - 流程
  浏览器 ---> nginx ---> /..     ---> 静态文件html/css/js/img
                   ---> /api/.. ---> 日志记录(日志文件)/路由处理/登陆校验(redis)/用户信息(redis)/数据处理(mysql)

- 用到了哪些核心知识点
  - http,nodejs处理http、处理路由、mysql
  - cookie、session、redis、nginx反向代理
  - 安全知识:sql注入、xss攻击、密码加密
  - 日志、stream、contrab、readline

- 回顾 server和前端的区别
  - 服务稳定性
  - 内存CPU优化扩展
  - 日志记录
  - 安全(包括登录验证)
  - 集群和服务拆分

# express
- Nodejs最常用的web server
- 下载、安装、使用、express中间件机制
- 开发接口、连接数据库、实现登录、日志记录
- 分析express中间件原理

## 介绍express
- 安装--express-generator脚手架
  - sudo npm i express-generator -g
  - express blog-express
  - npm i & npm start
  - npm i cross-env nodemon -D
- 初始化代码介绍、处理路由
- 使用中间件

## app.js
- 各个插件的作用 
- 思考更插件的实现原理
- 处理get/post请求

## 中间件机制
