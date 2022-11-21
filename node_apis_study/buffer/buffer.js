const log = console.log;

// 二进制
const buf1 = Buffer.alloc(10);
log(buf1); // <Buffer 00 00 00 00 00 00 00 00 00 00> 10个占位

// 十进制
const buf2 = Buffer.from('a');
log(buf2); // <Buffer 61>

const buf3 = Buffer.from('中文');
log(buf3); // <Buffer e4 b8 ad e6 96 87> e4 b8 ad 三个字节代表一个中文
log(buf3.toString()); // 中文

// buffer连接 可以断点续传
const buf4 = Buffer.concat([buf2, buf3]);
log(buf4); // <Buffer 61 e4 b8 ad e6 96 87> 61 + e4 b8 ad e6 96 87
log(buf4.toString()); // a中文