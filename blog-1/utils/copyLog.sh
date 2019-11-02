#!/bin/sh
cd /Users/yuxiaoyang03/Desktop/learning/Node-Blog/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
