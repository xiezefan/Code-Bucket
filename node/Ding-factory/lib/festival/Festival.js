var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require('../config/index');

mongoose.connect(Config.mongodb.host);

var festivalSchema = new Schema({
    name:String,
    date:String,
    offset:Number,
    text:String,
    beforeText:String
});

/*---- method ----*/

/*---- static method ----*/

module.exports = mongoose.model('Festival', festivalSchema);

