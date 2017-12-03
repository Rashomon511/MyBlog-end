const express = require('express');
const router = express.Router();
const models = require('../models/index');
const jwt = require('jsonwebtoken'); //jwt-token
const secret='rashomon_wh';
const md5=require('md5');
const user=models.user;
const article=models.article;
const articleComment=models.articleComment;
const resume=models.resume;
const tags=models.tags;
const articleLabel=models.articleLabel;

const decodeToken = (token,callback) => {
    try {
        jwt.verify(token, secret);
        callback(true)
    } catch (err) {
        console.log(err)
        callback(false)
    }
};

//需要验证token的中间件
const FindToken = (req, res, next) => {
    let token = req.headers['authorization'];
    decodeToken(token, type => {
        if (!type) {
            //token过期
            res.json({ code: 300, msg: 'token过期' })
        } else {
            next()
        }
    })
};

router.post('/login', async(req, res)=>{
    try{
        const userName=req.body.userName;
        const password=req.body.password;
        let data = await user.find({userName: userName, password: md5(password)});
        if (data.length > 0) {
            //生成token 时间一周
            let token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (7 * 60 * 60), userName: userName, password: password }, secret);

            res.json({ code: 200, msg: '登录成功', result: {token: token, auth: data[0].auth }  });
        } else {
            res.json({ code: 400, msg: '账号密码错误' });
        }
    }
    catch(err) {
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

// 获取标签
router.get('/getTags', async(req,res)=>{
    try {
        let data=await tags.find();
        res.json({ data: data, code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

// 新建标签
router.post('/createTags',FindToken,  async(req,res)=>{
    try {
        let body=req.body;
        let data={
            content: body.content
        };
        let tag = await tags.find(data);
        if(tag.length === 0){
            await new tags(data).save();
            res.json({ data: '', code: 200, msg: '成功' })
        }else{
            res.json({ data: '', code: 200, msg: '成功' })
        }
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

// 删除标签
router.post('/deleteTags',FindToken,  async(req,res)=>{
    try {
        let body=req.body;
        await tags.find({_id: body.id}).remove();
        res.json({ data: '', code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

// 获取简历
router.get('/getResume', async(req,res)=>{
    try {
        let data= await resume.find();
        res.json({ data: data, code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

// 提交简历
router.post('/saveResume',FindToken, async(req,res)=>{
    try {
        let body=req.body;
        let data={
            content: body.content, //转换后显示的内容
            //initContent: body.initContent //未转换的内容
        };
        await new resume(data).save();
        res.json({ data: '', code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.post('/saveArticle', async(req,res)=>{
    try {
        let body=req.body;
        let data={
            date: body.date,
            title: body.title,
            draft: body.draft,
            tags: body.tags,
            //abstract: body.abstract,
            content: body.content,
            //initContent: initContent
        }
        await new article(data).save();
        res.json({ data: '', code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.get('/getArticle', async(req,res)=>{
    try {
        let data=await article.find();
        res.json({ data: data, code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.post('/updateArticle', async(req,res)=>{
    try {
        let body=req.body;
        let articleId=body.id;
        let data={
            date: body.data,
            title: body.title,
            draft: body.draft,
            abstract: body.abstract,
            content: content,
            initContent: initContent
        }
        await article.findByIdAndUpdate(articleId,data)
        res.json({ data: '', code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.post('/saveComment', async(req,res)=>{
    try {
        let body=req.body;
        let data={
            replyId: body.replyId,
            toUserName:  body.toUserName,
            email: body.email,
            replyTime: body.replyTime,
            isAdmin: body.isAdmin,
            content: body.content,
            state: body.state
        };
        await new articleComment(data).save();
        res.json({ data: '', code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.get('/getComment', async(req,res)=>{
    try {
        let data=await articleComment().find();
        res.json({ data: data, code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});







module.exports = router;
