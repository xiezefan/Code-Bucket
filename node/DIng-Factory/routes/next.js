var express = require('express');
var ddHelper = require('../common/dingdong-helper');
var router = express.Router();

var Server = require('../models/server');


router.post('/product', function(req, res) {
    ddHelper.process(req, res, {
        onServiceCreate : function(data, done) {
            var server = new Server();
            server.sid = data.sid;
            server.apiSecret = data.api_secret;
            server.title = data.title;
            server.module = 'next_product';
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