var express = require('express');
var router = express.Router();
const models = require('../models/index');
const user=models.user;
/* GET home page. */


router.get('/', function(req, res, next) {
    user.find({},function(err,doc){
        res.render('index', { title: doc });
    })
});

module.exports = router;
