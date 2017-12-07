const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    date: Date,
    title: String,
    tags: Array,
    draft: { type: Boolean, default: false },
    abstract: String,
    content: String,
});