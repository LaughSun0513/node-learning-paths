class myExpress {
  constructor(){
    this.routes = {
      all:[],
      get:[],
      post:[]
    }
  }
  // 处理参数
  handleArgs(args){
    let obj={};
    if(typeof args[0] === 'string'){

    }
  }
  use(fn){
    this.routes.all.push(fn);
  }
  get(fn){

  }
  post(){

  }
}
module.exports = ()=>{
  return new myExpress();
}