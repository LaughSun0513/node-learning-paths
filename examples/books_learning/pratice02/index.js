const CountStream = require("./countstream");
const countstream = new CountStream("book");
const http = require("http");

const log = console.log;
// log(countstream);
http.get("http://www.manning.com", function(res) {
    res.pipe(countstream);
});
countstream.on("total", function(count) {
    log("Total matches:", count);
});
