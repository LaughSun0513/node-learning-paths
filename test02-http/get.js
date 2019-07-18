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