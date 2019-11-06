 const http = require('http');
 const slice = Array.prototype.slice;
 class myExpress {
    constructor(){
      this.routes = {
        use:[],
        get:[],
        post:[]
      }
    }
    handleParams(path){
      const info = {};
      if(typeof path === 'string'){ // 如果第一个参数是字符串，说明是路径
        info.path = path;
        info.stack = slice.call(arguments,1); // 剩下的参数，如各种func回调函数收集到数组stack里
      }else{
        info.path = "/"; // 没传字符串，默认为'/'
        info.stack = slice.call(arguments,0);
      }
      return info;
    }
    use(){
      const info = this.handleParams.apply(this,arguments); // 将所有app.use内的参数全部传入handleParams
      this.routes.use.push(info);
    }
    get(){
      const info = this.handleParams.apply(this,arguments); // 将所有app.get内的参数全部传入handleParams
      this.routes.get.push(info);
    }
    post(){
      const info = this.handleParams.apply(this,arguments); // 将所有app.post内的参数全部传入handleParams
      this.routes.post.push(info);
    }
    listen(...args){
      //通过listen来触发服务
      const server = http.createServer(this.handleServer()); // 这里面执行服务具体内容
      server.listen(...args);
    }
    handleServer(){
      return (req,res) => {
        // 初始化定义res.json
        res.json = (data) => {
          res.setHeader('Content-type','application/json');
          res.end(JSON.stringify(data));
        }

        // 根据访问的URL接口解析List里的中间件函数
        const method =  req.method.toLowerCase();
        const url = req.url;
        const resList = this.handleMiddleWareFunc(method,url); // 获取到最终的中间件函数的集合之后，接下去进行逐个执行
        this.iteratorList(req,res,resList); // next的核心代码
      }
    }
    handleMiddleWareFunc(method,url){
      let resList = [];
      if(url === '/favicon.ico'){
          return resList;
      }

      // 关键：汇总所有的中间件函数，进行执行
      let middleWareFuncList = [];
      middleWareFuncList = middleWareFuncList.concat(this.routes.use); //app.use的都要
      middleWareFuncList = middleWareFuncList.concat(this.routes[method]); // 根据method合并剩下的中间件函数
      console.log(middleWareFuncList);
      middleWareFuncList.forEach(itemInfo=>{
         // 命中URL的都过滤到最终的resList里
         if(itemInfo && url.indexOf(itemInfo.path) === 0 ){ 
            resList = resList.concat(itemInfo.stack);
         }
      });
      return resList;
    }
    iteratorList(req,res,resList){
      const next = () => {
        // 拿到第一个匹配的中间件，这里利用栈的模式,不停地弹出中间件函数
        const curMiddleWareFunc = resList.shift();
        if(curMiddleWareFunc){
          curMiddleWareFunc(req,res,next);
        }
      }
      next()
    }
    
 }

 module.exports = () => {
    return new myExpress();
 }
 // http://localhost:3001/api/get-cookie 测试