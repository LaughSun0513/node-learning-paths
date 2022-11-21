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