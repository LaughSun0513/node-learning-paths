// 获取用户发帖的列表信息 API
// 从数据库获取的发帖内容，但是这部分只包含用户 ID
// 需要通过 ID 批量拉取用户信息

// 拉取列表内容接口 GET /v1/contents
// 获取用户信息 GET /v1/userinfos

const http = require("http");
const { parse } = require("url");

const app = http.createServer(async (req, res, next) => {
    const { pathname, query } = parse(req.url); // /a/b ?query=xxx
    console.log(pathname, query);
});
app.listen("8001", () => {
    console.log("server is begin");
});
