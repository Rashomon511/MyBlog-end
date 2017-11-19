const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    date: Date,
    title: String,
    draft: { type: Boolean, default: false },//是否是草稿
    abstract: String, //首页文章列表显示的简介
    content: String, //转换后文章的详情
    initContent: String //未转换文章的详情——草稿
});