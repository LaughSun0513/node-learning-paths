const getList = (author,keyword) => {
    console.log(author,keyword)
    return [
      {
        id:1,
        title:'博文A',
        content:"内容A",
        author:"zhangsan"
      },
      {
        id:2,
        title:'博文B',
        content:"内容B",
        author:"lisi"
      }
    ]
}
const getDetail = (id) => {
  return {
        id:1,
        title:'博文A',
        content:"内容A",
        author:"zhangsan"
  }
}
const newBlog = (blogData = {}) => {
  return {
    id:3
  }
}
const updateBlog = (id,blogData = {}) => {
    // id 要更新的博客id
    // blogData 博客对象 包含title content对象
    console.log('update blog',id,blogData);
    return true;
}
const delBlog = (id) => {
  //id 要删除的博客id
   return true;
}
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}