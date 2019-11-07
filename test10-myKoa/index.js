const http = require('http');
// 洋葱卷模型的关键代码 -- 怎么进行一层层解析async/await请求的
function compose(middleWareList) {
    return function(ctx){
         function dispatch(i){
            const fn = middleWareList[i];
            try {
              return Promise.resolve(
                fn(ctx,dispatch.bind(null,i+1))
              );//关键代码!!通过递归调用当前的async函数，再将上下文ctx传入，继续执行dispatch.bind(null,i+1)执行下一个中间件函数
            }catch(e){
              return Promise.reject(e);
            }
         }  
         return dispatch(0);
    }
}

class myKoa {
  constructor() {
    this.middleWareList = []
  }
  use(fn) {
    this.middleWareList.push(fn); //将所有中间件先收集起来
    return this;
  }
  listen(...args) {
    const server = http.createServer(this.handleServer());
    server.listen(...args);
  }
  handleServer() {
    const fn = compose(this.middleWareList);
    return (req, res) => {
      const ctx = this.createContext(req, res);
      return fn(ctx); //执行调用中间件函数 ，类似next机制
    }
  }
  createContext(req, res){
    // 上下文其实就是req，res的封装
    const ctx = {
      req,
      res
    }
    ctx.query = req.query;
    ctx.method = req.method;
    ctx.url = req.url;
    const setMap = {};
    ctx.set = (key,str2)=>{
        setMap[key] = str2;
    }
    ctx.response = {
      get:(key)=>{
        return setMap[key];
      }
    }
    return ctx;
  }
}
module.exports = myKoa;