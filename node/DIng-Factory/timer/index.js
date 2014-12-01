/**
 * 定时器管理类
 * @type {later|exports}
 */
var later = require('later');
var Config = require('../config');
var redis = require('redis');
var Util = require('../common/util');

// redis
var client = redis.createClient(Config.redis.port, Config.redis.host);

exports.run = function() {

};


var cron = '*/1 * * * * * *';
var s = later.parse.cron(cron, false);


later.setInterval(function() {
    console.log(new Date());
}, s);

console.log('Timer Running.');

