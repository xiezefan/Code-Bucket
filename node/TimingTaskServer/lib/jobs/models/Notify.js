var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/agenda-example');

var notifySchema = new Schema({
    title:String,
    notify_url:String,
    params:[{key:String, value:String}],
    status:String,
    date:{type:Date,default:Date.now }
});

/*---- method ----*/

/*---- static method ----*/

module.exports = mongoose.model('Notify', notifySchema);



