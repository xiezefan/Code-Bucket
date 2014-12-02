var express = require('express');
var router = express.Router();
var log = require('../log/index')('Simple Subscribe Factory');
var async = require('async');
var later = require('later');

var Service = require('../service');
var PushClient = require('../push');
var Simple = require('./SimpleSubscribe');

router.post('/', function(req, res) {
    var reqData = req.body;
    log.debug('POST /simple ' + JSON.stringify(reqData));

    if (reqData.action) {
        switch (reqData.action) {
            case 'ACTION_SERVICE_CREATE':
                if (reqData && reqData.s_data) {
                    var s_data = JSON.parse(reqData.s_data);
                    var type = s_data.type;
                    reqData['type'] = 'SIMPLE_SUBSCRIBE_' + type;
                    var service = new Service(reqData);
                    service.save(function(err) {
                        if (err) log.error(err);
                    });
                }
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

router.post('/task', function(req, res) {
    var reqData = req.body;
    log.debug('POST /simple/task ' + JSON.stringify(reqData));

    var simple = new Simple(reqData);
    simple.save(function(err, result) {
        if (err) res.status(500).send('Bad Server');
        res.json({code:3002, content:result});
    });
});

router.post('/notify', function(req, res) {
    var reqData = req.body;
    log.debug('POST /simple/notify ' + JSON.stringify(reqData));

    var type = reqData.type;
    var article = {
        title : reqData.title,
        summary : reqData.summary,
        link : reqData.link
    };

    Service.find({type:'SIMPLE_SUBSCRIBE_' + type}, function(err, services) {
        if (err) log.error(err);

        async.each(services, function(service, callback) {
            if (service.sid && service.cid) {
                PushClient.push(service.sid, service.cid)
                    .setAudience(PushClient.ALL)
                    .setPlatform(PushClient.ALL)
                    .setType(PushClient.ARTICLE)
                    .setArticle(article)
                    .send(callback);
            } else {
                log.error('Invalid Service: %s', JSON.stringify(service));
            }
        }, function(err) {
            if (err) log.error(err);
        });

    });

    res.json({code:3000, content:'success'});
});

module.exports = router;

