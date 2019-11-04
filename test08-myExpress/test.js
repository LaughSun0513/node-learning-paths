const app = require('./index')();

app.use((req,res,next)=>{
  console.log('准备接受请求。。。');
  next();
});
app.use((req,res,next)=>{
  res.cookie={
    userId:'123'
  }
  next();
});
app.use((req,res,next)=>{
  setTimeout(()=>{
    // 异步请求
    next();
  },1000)
});

app.use('/api',(req,res,next)=>{
  console.log('接受 /api 请求。。。');
  next();
});
app.get('/api',(req,res,next)=>{
  console.log('接受 get /api请求。。。');
  next();
});
app.post('/api',(req,res,next)=>{
  console.log('接受 post /api请求。。。');
  next();
});

app.get('/api/get-cookie',(req,res,next)=>{
  console.log('接受get-cookie');
  res.json({
    errno:0,
    data:req.cookie
  })
});
app.post('/api/post-data',(req,res,next)=>{
  console.log('接受post-data');
  res.json({
    errno:0,
    data:req.body
  })
});

app.use((req,res,next)=>{
  res.json({
    errno:-1,
    msg:'404 NOT FOUND'
  })
})

app.listen(3000,()=>{
  console.log('server is running on port 3000');
});
