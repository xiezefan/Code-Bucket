var Schema = require('jugglingdb').Schema;
var Config = require('../config');
var schema = new Schema('redis', {port: Config.redis.port, host: Config.redis.host});


var Mission = schema.define('mission', {
    website : {type:String, index:true},
    bookId : {type:String, index:true},
    sid : String,
    cid : {type:String, index:true},
    lastChapter : String
});

module.exports = Mission;


