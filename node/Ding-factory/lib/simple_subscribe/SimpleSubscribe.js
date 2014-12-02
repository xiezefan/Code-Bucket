var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require('../config/index');

mongoose.connect(Config.mongodb.host);

var simpleSubscribeSchema = new Schema({
    type:String,
    title:String,
    summary:String,
    link:String,
    cron:String
});

/*---- method ----*/

/*---- static method ----*/

module.exports = mongoose.model('SimpleSubscribe', simpleSubscribeSchema);