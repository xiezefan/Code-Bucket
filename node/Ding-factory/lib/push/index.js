var Config = require('../config');
var Service = require('../service');

var request = require('request');
var log = require('../log')('Festival Factory');


var PushClient = module.exports = function() {};

PushClient.push = function(sid, cid){
    return new Payload(sid, cid);
};

var Payload = function(sid, cid) {
    this.sid = sid;
    this.cid = cid;
};

PushClient.ALL = 'all';
PushClient.ARTICLE = 'ARTICLE';
PushClient.TEXT = 'TEXT';
PushClient.DING = 'DING';

Payload.prototype.setPlatform = function(platform) {
    this.platform = platform;
    return this;
};

Payload.prototype.setAudience = function(audience) {
    this.audience = audience;
    return this;
};

Payload.prototype.setType = function(type) {
    this.type = type;
    return this;
};

Payload.prototype.setText = function(text) {
    this.text = text;
    return this;
};

Payload.prototype.setArticle = function(article) {
    this.article = article;
    return this;
} ;

Payload.prototype.send = function(done) {
    var _payload = this;

    if (!(_payload.sid
        && _payload.cid
        && _payload.platform
        && _payload.audience
        && _payload.type
        && (_payload.type != Payload.TEXT || _payload.text)
        && (_payload.type != Payload.ARTICLE || _payload.article))) {
        return done('INVALID PARAMETERS');
    }

    Service.find({sid:this.sid}, function(err, service) {
        if (err) return done(err);
        if (!service) return done('SERVICE NOT FOUND');
        service = service[0];

        var auth = "Basic " + new Buffer(_payload.sid + ':' + service.api_secret).toString('base64');
        var url = Config.dingService.pushPath.replace("{sid}", _payload.sid).replace("{cid}", _payload.cid);
        var body = {
            platform : _payload.platform,
            audience : _payload.audience,
            type : _payload.type,
            text : _payload.text,
            article : _payload.article
        };
        request.post({
            headers : {"Authorization": auth},
            url : url,
            body : JSON.stringify(body)
        }, function(err, res, body) {
            if (err) return done(err);

            if (body && JSON.parse(body).code == 3000) {
                log.debug("Push Success, Body " + body);
                return done(null, body);
            } else {
                return done('INVALID RESPONSE');
            }
        });
    });
};








