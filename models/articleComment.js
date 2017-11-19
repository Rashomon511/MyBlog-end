const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    articleId: String, //文章id
    replyId: String, //这篇回复的id
    toUserName:  String, //评论人姓名、昵称
    email: String, //评论人邮箱
    replyTime: Date, //评论时间,时间戳
    isAdmin: { type: Boolean, default: false }, //是否是admin回复
    content: String, //评论内容
    state: { type: Boolean, default: false } //是否审核通过 0, 未审核通过 1 审核通过
});