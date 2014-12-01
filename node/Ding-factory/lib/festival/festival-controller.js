var express = require('express');
var router = express.Router();
var log = require('../log/index')('Festival Factory');
var async = require('async');
var later = require('later');

var PushClient = require('../push');
var Service = require('../service');
var Festival = require('./Festival');

router.post('/', function(req, res) {
    var reqData = req.body;
    log.debug('POST /festival ' + JSON.stringify(reqData));

    if (reqData.action) {
        switch (reqData.action) {
            case 'ACTION_SERVICE_CREATE':
                reqData['type'] = 'FESTIVAL';
                var service = new Service(reqData);
                service.save(function(err) {
                    if (err) log.error(err);
                });
                break;
            case 'ACTION_CLIENT_SERVICE_CREATE':
                Service.find({sid:reqData.sid}, function(err, services) {
                    if (err) log.error(err);
                    if (services && services.length > 0) {
                        var service = services[0];
                        service.cid = reqData.cid;
                        service.save(function(err) {
                            if (err) log.error(err);
                        });
                    } else {
                        log.error('Service %s not found', reqData.sid);
                    }
                });
                break;
            default :
                // ignore
        }
    }

    res.json({code:3000, content:'success'});
});

router.get('/notify', function(req, res) {
    var reqData = req.body;
    log.debug('POST /festival/notify ' + JSON.stringify(reqData));

    notify();

    res.json({code:3000, content:'success'});
});


// 计算给定日期距离 2014-12-1 号多少天, 注:2014-12-1 距离 2014-12-1 为 1天
var mouthLength = [31,31,28,31,30,31,30,31,31,30,31,30,31];
function buildOffset(date) {
    var dateArr = date.split('-');

    if (dateArr[0] == '2014') {
        return parseInt(dateArr[2]);
    }

    var offset = mouthLength[0];
    for (var i=1; i<parseInt(dateArr[1]); i++) {
        offset += mouthLength[i];
    }

    offset += parseInt(dateArr[2]);
    return offset;
}

// 提醒逻辑
function notify() {
    var now = new Date();
    now = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    var offset = buildOffset(now);

    Service.find({type:'FESTIVAL'}, function(err, services) {
        if (err) return log.error(err);


        async.each(services, function(service, callback) {

            Festival.find({offset:offset}, function(err, festivals) {
                if (err) return callback(err);
                async.each(festivals, function(item, callback) {
                    if (!item.text) {
                        item.text = '今天是' + item.name + '，不要忘记给TA买礼物哟。'
                    }
                    var text = {content : item.text};
                    PushClient.push(service.sid, service.cid)
                        .setAudience(PushClient.ALL)
                        .setPlatform(PushClient.ALL)
                        .setType(PushClient.TEXT)
                        .setText(text)
                        .send(callback);
                }, function(err) {
                    if (err) return callback(err);
                });
            }, function(err){
                if (err) return log.error(err);
            });

            Festival.find({offset:offset + 5}, function(err, festivals) {
                if (err) return callback(err);
                async.each(festivals, function(item, callback) {
                    if (!item.text) {
                        item.text = '5天后是' + item.name + '，不要忘记给TA买礼物哟。'
                    }

                    var text = {content : item.text};
                    PushClient.push(service.sid, service.cid)
                        .setAudience(PushClient.ALL)
                        .setPlatform(PushClient.ALL)
                        .setType(PushClient.TEXT)
                        .setText(text)
                        .send(callback);
                }, function(err) {
                    if (err) return callback(err);
                });
            });
        }, function(err) {
            if (err) return log.error(err);
        })
    });
}



// 初始化定时器
later.date.localTime();
// 每天早上定时提醒
var schedule = later.parse.recur().on('10:00:00').time();
later.setInterval(function() {
    log.debug('Festival Notify Factory Execute...');
    notify();
}, schedule);

log.debug('Festival Notify Factory Running...');

module.exports = router;