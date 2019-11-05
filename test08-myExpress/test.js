const app = require('./index')();

app.use((req,res,next)=>{
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
  next();
});
app.get('/api',(req,res,next)=>{
  console.log('5。。。');
  next();
});
app.post('/api',(req,res,next)=>{
  console.log('6。。。');
  next();
});

app.get('/api/get-cookie',(req,res,next)=>{
  console.log('7。。。');
  res.json({
    errno:0,
    data:req.cookie
  })
});
app.post('/api/post-data',(req,res,next)=>{
  console.log('8.。。。。。。');
  res.json({
    errno:0,
    data:req.body
  })
});

app.use((req,res,next)=>{
  console.log('9.。。。。。。');
  res.json({
    errno:-1,
    msg:'404 NOT FOUND'
  })
})

app.listen(3000,()=>{
  console.log('server is running on port 3000');
});
