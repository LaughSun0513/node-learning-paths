const http = require('http');
// const slice = Array.prototype.slice;
class myExpress {
  constructor(){
    this.routes = {
      all:[],
      get:[],
      post:[]
    }
  }
  // 处理参数
  handleArgs(path){
    let obj={};
    if(typeof path === 'string'){
        obj.path = path;
        obj.stack = Array.prototype.slice.call(arguments,1);
    }else{
        obj.path = '/';
        obj.stack = Array.prototype.slice.call(arguments,0);
    }
    return obj;
  }
  use(){
    const info = this.handleArgs.apply(this,arguments);
    this.routes.all.push(info);
  }
  get(){
    const info = this.handleArgs.apply(this,arguments);
    this.routes.get.push(info);
  }
  post(){
    const info = this.handleArgs.apply(this,arguments);
    this.routes.post.push(info);
  }
  init(){
    return (req,res)=>{
      res.json = (data) => {
          res.setHeader('Content-type','application/json');
          res.end(JSON.stringify(data));
      }

      const url = req.url;
      const method = req.method.toLowerCase();
      const middleWareArr = this.match(url,method); // 根据url取出符合条件的中间件合集数组
      
      this.handleMiddleWare(req,res,middleWareArr);
    }
  }
  match(url,method){
    let arr = [];
    if(url === '/favicon.ico'){
      return arr;
    }
    
    let curRoutes=[];
    curRoutes = curRoutes.concat(this.routes.all);
    curRoutes = curRoutes.concat(this.routes[method]);

    curRoutes.forEach(routeInfo=>{
      if(url.indexOf(routeInfo.path)===0){
          arr = arr.concat(routeInfo.stack);
      }
    });
    console.log(JSON.stringify('====>'+JSON.stringify(arr)))
    return arr;
  }
  handleMiddleWare(req,res,middleWareArr){
      const next = () => {
        const first = middleWareArr.shift();
        if(first){
          first(req,res,next)
        }
      }
      next()
  }
  listen(...args){
      const server = http.createServer(this.init());
      server.listen(...args);
      console.log(JSON.stringify(this.routes));
  }
}
module.exports = ()=>{
  return new myExpress();
}