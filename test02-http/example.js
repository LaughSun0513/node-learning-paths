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