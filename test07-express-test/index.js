const app = require('express')();

app.use((req,res,next)=>{
  // console.log('准备接受请求。。。');
  console.log('1。。。');
  next();
});
app.use((req,res,next)=>{
  console.log('2。。。');
  res.cookie={
    userId:'123'
  }
  next();
});
app.use((req,res,next)=>{
  console.log('3。。。');
  setTimeout(()=>{
    // 异步请求
    next();
  },1000)
});

app.use('/api',(req,res,next)=>{
  console.log('4。。。');
  // console.log('接受 /api 请求。。。');
  next();
});
app.get('/api',(req,res,next)=>{
  console.log('5。。。');
  // console.log('接受 get /api请求。。。');
  next();
});
app.post('/api',(req,res,next)=>{
  // console.log('接受 post /api请求。。。');
  console.log('6。。。');
  next();
});

app.get('/api/get-cookie',(req,res,next)=>{
  // console.log('接受get-cookie');
  console.log('7。。。');
  res.json({
    errno:123,
    data:req.cookie
  })
});
app.post('/api/post-data',(req,res,next)=>{
  // console.log('接受post-data');
  console.log('8。。。');
  res.json({
    errno:456,
    data:req.body
  })
});

app.use((req,res,next)=>{
  console.log('9。。。');
  res.json({
    errno:789,
    msg:'404 NOT FOUND'
  })
})

app.listen(3000,()=>{
  console.log('server is running on port 3000');
});

// http://localhost:3000/api/get-cookie
/* 了解了执行顺序，就了解了中间件机制
准备接受请求。。。
接受 /api 请求。。。
接受get-cookie
*/