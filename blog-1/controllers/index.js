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
module.exports = {
  getList,
  getDetail
}