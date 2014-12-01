var express = require('express');
var router = express.Router();

var Server = require('../models/server');
var qidian = require('../spider/qidian-spider');
var zongheng = require('../spider/zongheng-spider');
var chuangshi = require('../spider/chuangshi-spider');
var u17 = require('../spider/u17-spider');

router.post('/qidian', function(req, res) {
    var reqData = req.body;
    console.log("[qidian] " + JSON.stringify(reqData));

    if ("ACTION_SERVICE_CREATE" == reqData.action) {
        var server = new Server();
        server.sid = reqData.sid;
        server.apiSecret = reqData.api_secret;
        server.title = reqData.title;
        server.data = reqData.s_data;
        server.save(function(err) {
            if (err) {
                return res.json({ code: 1000, content:"DB fail." });
            }
            res.json({ code: 3000, content:"success" });
        });
    } else if ("ACTION_CLIENT_SERVICE_CREATE" == reqData.action) {
        var data = JSON.parse(reqData.data);
        qidian.register(reqData.sid, reqData.cid, data.book_name, function(err, mission) {
            if (err) {
                res.json({ code: 1001, message:"查找不到该书，目前只支持 起点 小说更新提醒" });
            } else {
                console.log("Add New Spider Mission : " + JSON.stringify(mission));
                res.json({ code: 3000, message:"success" });
            }
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

router.post('/zongheng', function(req, res) {
    var reqData = req.body;
    console.log("[zongheng] " + JSON.stringify(reqData));

    if ("ACTION_SERVICE_CREATE" == reqData.action) {
        var server = new Server();
        server.sid = reqData.sid;
        server.apiSecret = reqData.api_secret;
        server.title = reqData.title;
        server.data = reqData.s_data;
        server.save(function(err) {
            if (err) {
                return res.json({ code: 1000, content:"DB fail." });
            }
            res.json({ code: 3000, content:"success" });
        });
    } else if ("ACTION_CLIENT_SERVICE_CREATE" == reqData.action) {
        var data = JSON.parse(reqData.data);
        zongheng.register(reqData.sid, reqData.cid, data.book_name, function(err, mission) {
            if (err) {
                res.json({ code: 1001, message:"查找不到该书，目前只支持 纵横中文网 小说更新提醒" });
            } else {
                console.log("Add New Spider Mission : " + JSON.stringify(mission));
                res.json({ code: 3000, message:"success" });
            }
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


router.post('/chuangshi', function(req, res) {
    var reqData = req.body;
    console.log("[chuangshi] " + JSON.stringify(reqData));

    if ("ACTION_SERVICE_CREATE" == reqData.action) {
        var server = new Server();
        server.sid = reqData.sid;
        server.apiSecret = reqData.api_secret;
        server.title = reqData.title;
        server.data = reqData.s_data;
        server.save(function(err) {
            if (err) {
                return res.json({ code: 1000, content:"DB fail." });
            }
            res.json({ code: 3000, content:"success" });
        });
    } else if ("ACTION_CLIENT_SERVICE_CREATE" == reqData.action) {
        var data = JSON.parse(reqData.data);
        chuangshi.register(reqData.sid, reqData.cid, data.book_name, function(err, mission) {
            if (err) {
                res.json({ code: 1001, message:"查找不到该书，目前只支持 创世中文网 小说更新提醒" });
            } else {
                console.log("Add New Spider Mission : " + JSON.stringify(mission));
                res.json({ code: 3000, message:"success" });
            }
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

router.post('/novel/u17', function(req, res) {
    var reqData = req.body;
    console.log("[u17] " + JSON.stringify(reqData));

    if ("ACTION_SERVICE_CREATE" == reqData.action) {
        var server = new Server();
        server.sid = reqData.sid;
        server.apiSecret = reqData.api_secret;
        server.title = reqData.title;
        server.data = reqData.s_data;
        server.save(function(err) {
            if (err) {
                return res.json({ code: 1000, content:"DB fail." });
            }
            res.json({ code: 3000, content:"success" });
        });
    } else if ("ACTION_CLIENT_SERVICE_CREATE" == reqData.action) {
        var data = JSON.parse(reqData.data);
        u17.register(reqData.sid, reqData.cid, data.book_name, function(err, mission) {
            if (err) {
                res.json({ code: 1001, message:"查找不到该书，目前只支持 有妖气 漫画更新提醒" });
            } else {
                console.log("Add New Spider Mission : " + JSON.stringify(mission));
                res.json({ code: 3000, message:"success" });
            }
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

module.exports = router;
