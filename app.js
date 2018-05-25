var express = require('express');
var path = require('path');
var session = require('express-session');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(''));
app.use(express.static(path.join(__dirname, 'public')));



// app.use(session({
//     secret : 'express_react_cookie',
//     resave: true,
//     saveUninitialized: true,
//     cookie : {maxAge:1000*60*60*24*30}
// }));

//允许跨域
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, access-token, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.use('/', index);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Blog',{useMongoClient: true}, function(err, res) {
    if (err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connected to Database');
    }
});



// catch 404 and forward to error handler

app.use(function(req, res) {
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'text/html');
    res.sendfile('public/dist/index.html');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// Environment sets...
var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3001); // 设定监听端口

// Environment sets...

//module.exports = app; //这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来

//启动监听
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
//module.exports = app; //这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来



module.exports = app;
