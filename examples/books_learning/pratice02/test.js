var assert = require("assert");
const CountStream = require("./countstream");
const countStream = new CountStream("example");

const fs = require("fs");
var passed = 0;
const log = console.log;

countStream.on("total", count => {
    assert.equal(count, 1);
    passed++;
});

fs.createReadStream(__filename).pipe(countStream);

process.on("exit", () => {
    log("Assertions passed:", passed);
});
