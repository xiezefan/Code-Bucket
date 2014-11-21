var Agenda = require('agenda');
/*
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('mydb', server, {safe:true});
*/


var agenda = new Agenda({db: { address: 'localhost:27017/agenda-example', collection: 'testdb' }});
/*
var job = agenda.create('notifyFactory', {url: "http://www.baidu.com"});
job.save(function(err) {
    console.log("Job successfully saved");
});
job.repeatEvery('5 seconds');
job.run(function(err, job) {
    console.log("EXECUTE: url=" + job.attrs.data.url);
});
*/

agenda.define('notifyFactory', {url: "http://www.baidu.com"}, function(job) {
    console.log("EXECUTE: url=" + job.attrs.data.url);
    console.log("Now:" + new Date())
});



//agenda.every('3 minutes', 'delete old users');

// Alternatively, you could also do:

agenda.every('5 seconds', 'notifyFactory');

agenda.start();


console.log("running");

