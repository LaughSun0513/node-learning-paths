const { doSQL } = require('../db/mysql');
const xss = require('xss');
/**
 * 获取博客列表数据 GET
 * http://localhost:8000/api/blog/list
 * http://localhost:8000/api/blog/list?author=zhangsan
 * http://localhost:8000/api/blog/list?author=zhangsan&keyword=A
 */
const getList = async (author,keyword) => {
    let sql = `select * from blogs where 1=1`
    if(author){
      sql += ` and author='${author}'`
    }
    if(keyword){
      sql += ` and title like '%${keyword}%'` //注意and 前面的空格
    }
    sql += ` order by 'createtime' desc;` //注意order 前面的空格
    return await doSQL(sql);
}

/**
 * 根据id获取单个博客详情 GET
 * http://localhost:8000/api/blog/detail?id=1
 * http://localhost:8000/api/blog/detail?id=2
 */
const getDetail = async (id) => {
  let sql = `select * from blogs where id=${id}`;
  return await doSQL(sql);
}
/**
 * 创建新的博客内容 POST
 * http://localhost:8000/api/blog/new
 * body 内容
  {
	  "title":"博客xx",
	  "content":"内容xx"
  } 
 */
const newBlog = async (blogData = {}) => {
  let { title,content,author} = blogData;
  // 预防xss攻击 转义js字符
  title = xss(title);
  content = xss(content);
  let createtime = Date.now();
  let sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}',${createtime},'${author}');` //注意执行顺序

  const insertData = await doSQL(sql);
  return {
    id:insertData.insertId //通过insertId来判断是否加载成功
  }
}
/**
 * 创建新的博客内容 POST
 * http://localhost:8000/api/blog/update?id=3
 * body 内容
  {
	  "title":"博客xxxx",
	  "content":"内容xxxxx"
  } 
 */
const updateBlog = (id,blogData = {}) => {
    // id 要更新的博客id
    // blogData 博客对象 包含title content对象
    console.log('update blog',id,blogData);
    let { title , content } = blogData;
    title = xss(title);
    content = xss(content);
    let sql = `update blogs set title='${title}', content='${content}' where id=${id};` //注意 ,空格 content='${content}'
    const updateRes = await doSQL(sql);
    if(updateRes.affectedRows > 0){ //根据affectedRows>0来判断是否更新成功
      return true;
    }
    return false;
    
}
/**
 * 创建新的博客内容 POST
 * http://localhost:8000/api/blog/del?id=3
 */
const delBlog = (id,author) => {
  //id 要删除的博客id
  let sql = `delete from blogs where id='${id}' and author='${author}';` //安全机制，保证作者一致
  const updateRes = await doSQL(sql);
  if(updateRes.affectedRows > 0){ //根据affectedRows>0来判断是否更新成功
    return true;
  }
  return false;
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}