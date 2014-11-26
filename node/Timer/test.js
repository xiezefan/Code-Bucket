var Agenda = require('agenda');
/*
var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('mydb', server, {safe:true});
*/


var agenda = new Agenda({db: { address: 'localhost:27017/agenda-example', collection: 'testdb3' }});

/*var job = agenda.create('notifyFactory', {url: "http://www.baidu.com"});
job.repeatEvery('5 seconds');
job.save(function(err) {
    console.log("Job successfully saved");
});*/

var job = agenda.create('testRepeatAt', {url: "http://www.baidu.com"});
job.repeatAt('11:28am');
job.save(function() {
    console.log("Job successfully saved");
});





agenda.define('testRepeatAt',  function(job) {
    console.log("EXECUTE: url=" + job.attrs.data.url);
    console.log("Now:" + new Date())
});


//agenda.every('3 minutes', 'delete old users');

// Alternatively, you could also do:

//agenda.every('5 seconds', 'notifyFactory');

agenda.start();


console.log("running");

