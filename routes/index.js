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
        console.log(err);
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
        let data= await resume.findOne();
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
        let id=body.id;
        let data={
            content: body.content, //转换后显示的内容
        };
        await resume.findByIdAndUpdate(id, data);
        res.json({ data: '', code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

// 保存文章
router.post('/saveArticle',FindToken, async(req,res)=>{
    try {
        const body=req.body;
        const id = req.body.id;
        const data={
            date: body.date,
            title: body.title,
            draft: body.draft,
            tags: body.tags,
            abstract: body.abstract,
            content: body.content,
        };
        if(id===''){
            await new article(data).save();
            const findData = await article.find();
            const article_id = findData[findData.length - 1]._id;
            const allTags=await tags.find();
            const tag=allTags.filter((item)=>{
                return body.tags.indexOf(item.content) !== -1
            });
            tag.forEach(async(item) => {
                await new articleLabel({ article_id: article_id, label_id: item._id }).save()
            });
            res.json({ data: '', code: 200, msg: '成功' })
        }else {
            await article.findByIdAndUpdate(id, data);
            await articleLabel.find().remove({ article_id: id });
            const allTags=await tags.find();
            const tag=allTags.filter((item)=>{
                return body.tags.indexOf(item.content) !== -1
            });
            tag.forEach(async(item) => {
                await new articleLabel({ article_id: id, label_id: item._id }).save()
            });
            res.json({ data: '', code: 200, msg: '成功' })
        }
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

// 获取文章
router.get('/getArticle', async(req,res)=>{
    try {
        const page=req.query.page;
        const draft=req.query.draft;
        if(draft === 'false'){
            const total = await article.count({draft: draft});
            let allData = await article.find({draft: draft});
            allData = allData.sort(function(a, b) {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            });
            const data=allData.slice((page-1)*5,page*5);
            res.json({ data: {data: data,total: total}, code: 200, msg: '成功' })
        }else{
            let allData=await article.find();
            allData = allData.sort(function(a, b) {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            });
            const data=allData.slice((page-1)*10,page*10);
            res.json({ data: {data: data,total: allData.length}, code: 200, msg: '成功' })
        }
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.get('/getArticleById', async(req,res)=>{
    try {
        let data=await article.find({_id: req.query.id});
        res.json({ data: data, code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.get('/getArticleList', async(req,res)=>{
    try {
        const page=req.query.page;
        let articles=await articleLabel.find({label_id: req.query.id});
        let list=[];
        for (let i = 0; i < articles.length; i++) {
            let item = articles[i],
                query = await article.findOne({ _id: item.article_id,draft: false }).lean();
            list.push(query)
        }
        list = list.length > 1 ? list.sort(function(a, b) {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        }):list;
        const data=list.slice((page-1)*10,page*10);
        res.json({ data: {list:data,total:list.length}, code: 200, msg: '成功' })
    }
    catch (err){
        console.log(err);
        res.json({ data: '', code: 500, msg: '服务器错误' })
    }
});

router.get('/deleteArticle', FindToken, async(req,res)=>{
    try {
        await article.find({_id: req.query.id}).remove();
        await articleLabel.find({article_id:req.query.id}).remove();
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
