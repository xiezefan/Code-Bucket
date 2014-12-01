var config = require('../config');
var request = require('request');
var Server = require('../models/server');

function push(option, callback) {
    var article = {title:option.title, summary:option.summary, cover_pic:option.cover_pic, link:option.link};
    var body = {audience:"all", type:"ARTICLE", article:article};

    Server.findOne({where:{sid: option.sid}}, function(err, server) {
        if (err) return callback(err);
        if (server) {
            request.post({
                headers : {"Authorization": "Basic " + new Buffer(option.sid + ':' + server.apiSecret).toString('base64')},
                url : config.server.pushPath.replace("{sid}", option.sid).replace("{cid}", option.cid),
                body : JSON.stringify(body)
            }, function(err, res, body) {
                if (err) {
                    return callback(err);
                } else {
                    try {
                        if (body) {
                            var result = JSON.parse(body);
                            if (result && result.code == 3000) {
                                console.log("Push Success, Body " + body);
                                return callback(null, body);
                            }
                        }
                        callback(body);
                    } catch (err) {
                        console.error('Invalid Server Response: %s', body);
                    }
                }
            });
        } else {
            console.log('[push] Server Not Found');
        }

    });
}


function _push(option, callback) {
    var article = {title:option.title, summary:option.summary, cover_pic:option.cover_pic, link:option.link};
    var body = {audience:"all", type:"ARTICLE", article:article};
    Server.findOne({where:{sid: option.sid}}, function(err, server) {
        if (err) return callback(err);
        if (server) {
            Server.getCID(option.sid, function(err, cid) {
                request.post({
                    headers : {"Authorization": "Basic " + new Buffer(option.sid + ':' + server.apiSecret).toString('base64')},
                    url : config.server.pushPath.replace("{sid}", option.sid).replace("{cid}", cid),
                    body : JSON.stringify(body)
                }, function(err, res, body) {
                    if (err) {
                        return callback(err);
                    } else {
                        if (body && JSON.parse(body).code == 3000) {
                            console.log("Push Success, Body " + body);
                            callback(null, body);
                        } else {
                            callback(body);
                        }
                    }
                });
            });

        } else {
            console.log('[push] Server Not Found');
        }
    });
}

function processReceive(req, res, options) {
    this.done = function(errmsg) {
        if (errmsg) {
            res.json({ code: 1001, message:errmsg});
        } else {
            res.json({ code: 3000, message:"success" });
        }
    };
    var data = req.body;
    console.log('[processReceive] Receive JSON : ' + JSON.stringify(data));

    if ("ACTION_SERVICE_CREATE" == data.action) {
        if (options.onServiceCreate && typeof options.onServiceCreate == 'function') {
            options.onServiceCreate(data, this.done);
        } else {
            console.log('Auto OnServiceCreate Process');
            this.done();
        }
    } else if ("ACTION_CLIENT_SERVICE_CREATE" == data.action) {
        if (options.onClintServiceCreate && typeof options.onClintServiceCreate == 'function') {
            options.onClintServiceCreate(data, this.done);
        } else {
            console.log('Auto OnClientServiceCreate Process');
            this.done();
        }
    } else if ("ACTION_SERVICE_FOLLOWED_CHANGE" == data.action) {
        if (options.onFollowedChange && typeof options.onFollowedChange == 'function') {
            options.onFollowedChange(data, this.done);
        } else {
            console.log('Auto OnServiceFollowed Process');
            this.done();
        }
    } else if ("ACTION_SERVICE_DING" == data.action) {
        if (options.onDing && typeof options.onDing == 'function') {
            options.onDing(data, this.done);
        } else {
            console.log('Auto OnDing Process');
            this.done();
        }
    } else {
        console.log('Undefined Action :' + data.action);
        this.done();
    }


}



exports.process = processReceive;

exports.pushImage = push;
exports.push = _push;
