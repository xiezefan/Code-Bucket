var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connect('mongodb://localhost:27017/agenda-example');

var Notify = new Schema({
    title:String,
    notify_url:String,
    params:String,
    date:{type:Date,default:Date.now }
});

/*Notify.methods.fingById = function(id, callback) {
    return this.model('mongoose').find({id: id}, callback);
};*/

var mongooseModel = db.model('mongoose', Notify);

/*
var notify = new mongooseModel({"id":"12345", title:"This is title", notify_url:"http://www.baidu.com"});
notify.save(function(err, obj) {
    console.log(obj._id);
});*/

mongooseModel.findById('547478b6d76661eb5cd0f0a2', console.log);