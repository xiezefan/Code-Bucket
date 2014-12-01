var express = require('express');
var ddHelper = require('../common/dingdong-helper');
var router = express.Router();

var Server = require('../models/server');

router.post('/movie/review', function(req, res) {
    var reqData = req.body;
    console.log("[douban movie review] " + JSON.stringify(reqData));

    if ("ACTION_SERVICE_CREATE" == reqData.action) {
        var server = new Server();
        server.sid = reqData.sid;
        server.apiSecret = reqData.api_secret;
        server.title = reqData.title;
        server.module = 'douban_movie';
        server.save(function(err) {
            if (err) {
                return res.json({ code: 1000, content:"DB fail." });
            }
            res.json({ code: 3000, content:"success" });
        });
    } else if ("ACTION_CLIENT_SERVICE_CREATE" == reqData.action) {
        Server.setCID(reqData.sid, reqData.cid, function(err) {
            if (err) return console.log(err);
            res.json({ code: 3000, content:"success" });
        });
    } else if ("ACTION_SERVICE_FOLLOWED_CHANGE" == reqData.action) {
        console.log("Receive a followed change action :" + JSON.stringify(reqData));
        res.json({ code: 3000, message:"success" });
    } else if ("ACTION_SERVICE_DING" == reqData.action) {
        console.log("Receive a ding action :" + JSON.stringify(reqData));
        res.json({ code: 3000, message:"success" });
    } else {
        console.log("Invalid Parameter " + JSON.stringify(reqData));
        res.json({ code: 3000, message:"success" });
    }
});

router.post('/book/review', function(req, res) {
    ddHelper.process(req, res, {
        onServiceCreate : function(data, done) {
            var server = new Server();
            server.sid = data.sid;
            server.apiSecret = data.api_secret;
            server.title = data.title;
            server.module = 'douban_book';
            server.save(function(err) {
                if (err) {
                    return done('服务器出错了，请稍后重试');
                }
                done();
            });
        },
        onClintServiceCreate : function(data, done) {
            Server.setCID(data.sid, data.cid, function(err) {
                if (err) return console.log(err);
                done();
            });
        }
    });
});

module.exports = router;