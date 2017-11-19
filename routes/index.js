var express = require('express');
var router = express.Router();
const models = require('../models/index');
const user=models.user;
/* GET home page. */


router.get('/', function(req, res, next) {
    console.log(1111)
    user.find({},function(err,doc){
        console.log(doc)
    })
  res.render('index', { title: 'Express' });
});

module.exports = router;
