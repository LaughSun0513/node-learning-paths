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
更新一篇博客      | /api/blog/new         |   post    | id  | postData中有更新的内容
删除一篇博客      | /api/blog/del         |   post    | id  | 
登录             | /api/user/login       |   post    |     | postData中有用户名和密码

### 3. 关于登录
- 业界有统一的解决方案，一般不用再重新设计


# 开发接口
## nodejs处理http请求
 - DNS解析 建立TCP连接 发送http请求
 - server接收到http请求，处理，并返回
 - 客户端接收到返回数据，处理数据（如渲染页面，执行js）

## 搭建开发环境
## 开发接口，暂不考虑连接数据库和登录