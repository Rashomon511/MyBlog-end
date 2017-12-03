const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    userName: String,
    password: String,
    auth: Boolean
});
