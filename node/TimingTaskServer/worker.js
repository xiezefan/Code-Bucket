var express = require('express');
var Agenda = require('agenda');
var agendaUI = require('agenda-ui');
var async = require('async');

var app = express();
var agenda = new Agenda({db: { address: '127.0.0.1:27017/timing-task-server', collection: 'test3'}});

/*app.use('/agenda-ui', agendaUI(agenda, {poll: 10000}));
app.get('/', function(req, res){
    res.send('hello world');
});


agenda.define('http-notify', function(job) {
    console.log(job.attrs.data)
});*/


var task = {
    "id":"12345",
    "title": "明天下雨提醒我",
    "notify_url": "http://xiezefan.qiniudn.com/test.json",
    "cron": "0 */10 * * * * * *",
    "params": {
        "key1": "value1",
        "key2": "value2"
    }
};
var job = agenda.create('http-notify', task);
job.repeatEvery(task.cron);
//console.log(job);
//agenda.saveJob(job, console.log);

/*agenda.jobs({}, function(err, jobs) {
    // Work with jobs (see below)
    console.log(jobs);
});*/
//{_id: '5476cd33b9f7d96d443d5242'}
/*agenda._db.find({name:"http-notify"}, function(err, res) {
    //res = res[0];
    res.toArray(console.log);



});*/

agenda.jobs({}, function(err, jobs) {
    async.each(jobs, function(job) {
        console.log(job.attrs.name);
    }, function(err) {
        console.log('[http-notify-task]' + err);
    });
});

//agenda.start();

//app.listen(3000);
//app.set('port', process.env.PORT || 3000);
//console.log('Express server listening on port 3000');

