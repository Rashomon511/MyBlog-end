const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    content: String, //转换后显示的内容
    initContent: String //未转换的内容
});