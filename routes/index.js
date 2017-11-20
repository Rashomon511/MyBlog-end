var express = require('express');
var router = express.Router();
const models = require('../models/index');
const jwt = require('jsonwebtoken'); //jwt-token
const secret='roshomon_js_li';
const md5=require('md5');
const user=models.user;
/* GET home page. */

const decodeToken = (token, cb) => {
    try {
        jwt.verify(token, secret)
        cb(true)
    } catch (err) {
        cb(false)
    }
} //需要token的中间件
const token = (req, res, next) => {
    let token = req.headers['access-token']
    console.log(token)
    decodeToken(token, type => {
        if (!type) {
            //token过期
            res.json({ code: 300, msg: 'token过期' })
        } else {
            next()
        }
    })
}

router.post('/', async(req, res)=>{
    try{
        const userName=req.body.userName;
        const password=req.body.password;
        let data = await user.find({ uerName: userName, password: md5(password) })
        console.log(data)
    }
    catch(err) {
        console.log(err)
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

module.exports = router;
