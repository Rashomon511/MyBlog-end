const mongoose = require('mongoose');
const user = require('./user');
const article = require('./article');
const articleComment = require('./articleComment');
const resume = require('./resume');
const tags = require('./tags');
const articleLabel = require('./articleLabel');

var models = {
    user: mongoose.model('user', user),
    article: mongoose.model('article', article),
    articleComment: mongoose.model('articleComment', articleComment),
    resume: mongoose.model('resume', resume),
    tags: mongoose.model('tags', tags),
    articleLabel: mongoose.model('articleLabel', articleLabel)
};

var users= new models.user({
    userName: '12211',
    password: '1dd11'
});

users.save()

module.exports = models;