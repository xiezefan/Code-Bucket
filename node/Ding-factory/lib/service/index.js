var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Config = require('../config/index');

mongoose.connect(Config.mongodb.host);

var serviceSchema = new Schema({
    type:String,
    sid:String,
    cid:String,
    title:String,
    api_secret:String,
    s_data:String,
    c_data:[{cid:String, data:String}]
});

/*---- method ----*/

/*---- static method ----*/

module.exports = mongoose.model('Service', serviceSchema);

