var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');

var domain = require('domain');

var routes = require('./routes/index');
var douban = require('./routes/douban');
var next = require('./routes/next');
var festival = require('./lib/festival');


var later = require('later');
var qidianSpider = require('./spider/qidian-spider');
var zonghengSpider = require('./spider/zongheng-spider');
var chuangshiSpider = require('./spider/chuangshi-spider');
var u17Spider = require('./spider/u17-spider');
var doubanMovieSpider = require('./spider/douban');
var doubanBookSpider = require('./spider/douban/book');
var nextSpider = require('./spider/next');

/*----logs----*/
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups:3,
            category: 'normal'
        }
    ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
/*----logs end----*/


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

app.use('/novel', routes);
app.use('/douban/', douban);
app.use('/next/', next);
app.use('/festival/', festival);

// catch 404 and forward
// to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;








var d = domain.create();

d.run(function() {
    // start timer
    var novelSpiderSchedule = later.parse.text('every 10 mins');
    later.setInterval(function() {
        qidianSpider.executeTask();
        zonghengSpider.executeTask();
        chuangshiSpider.executeTask();
        u17Spider.executeTask();
    }, novelSpiderSchedule);

    var doubanSpiderSchedule = later.parse.text('every 2 hour');
    later.setInterval(function() {
        doubanMovieSpider.spiderTask();
        doubanBookSpider.spiderTask();
    }, doubanSpiderSchedule);

    var doubanPushTaskSeched = {
        schedules:[
            {h: [11], m: [30]},
            {h: [23], m: [0]}
        ]
    };
    // 设置使用当地时间
    later.date.localTime();
    later.setInterval(function() {
        doubanMovieSpider.pushTask();
        doubanBookSpider.pushTask();
    }, doubanPushTaskSeched);

    var nextSpiderTaskSchedule = {
        schedules:[
            {h: [11], m: [30]}
        ]
    };

    later.setInterval(function() {
        nextSpider.spiderTask();
    }, nextSpiderTaskSchedule);

    var nextPushTaskSchedule = {
        schedules:[
            {h: [12], m: [0]},
            {h: [21], m: [0]}
        ]
    };

    later.setInterval(function() {
        nextSpider.pushTask();
    }, nextPushTaskSchedule);
});

d.on('error', function(err) {
    console.error('Error caught by domain:', err);
});


process.on('uncaughtException', function(err) {
    console.error('uncaughtException: %s', err.stack);
});

console.log("Initialize Spider Success, Service Running!");
