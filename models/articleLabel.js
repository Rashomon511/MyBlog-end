const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    article_id: String,
    label_id: String
});