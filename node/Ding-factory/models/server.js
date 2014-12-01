var Schema = require('jugglingdb').Schema;
var Config = require('../config');
var redis = require('redis');
var schema = new Schema('redis', {port: Config.redis.port, host: Config.redis.host});
var client = redis.createClient(Config.redis.port, Config.redis.host);

var KEY_CLIENT_SERVER = "server.cid:{sid}";

var Server = schema.define('server', {
    sid : {type:String, index:true},
    title : String,
    data : String,
    apiSecret : String,
    module: {type:String, index:true}
});

Server.prototype.getCID = function(callback) {
    client.get(KEY_CLIENT_SERVER.replace("{sid}", this.sid), callback)
};

Server.setCID = function(sid, cid, callback) {
    client.set(KEY_CLIENT_SERVER.replace("{sid}", sid), cid, callback);
};

Server.getCID = function(sid, callback) {
    client.get(KEY_CLIENT_SERVER.replace("{sid}", sid), callback);
};


module.exports = Server;

