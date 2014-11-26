var express = require('express');
var Agenda = require('agenda');
var agendaUI = require('agenda-ui');

var app = express();
var agenda = new Agenda({db: { address: '127.0.0.1:27017/timing-task-server', collection: 'notifyJobs'}});

app.use('/agenda-ui', agendaUI(agenda, {poll: 10000}));
app.get('/', function(req, res){
    res.send('hello world');
});


agenda.define('http-notify', function(job) {
    console.log(job.attrs.data)
});


/*var task = {
    "title": "明天下雨提醒我",
    "notify_url": "http://xiezefan.qiniudn.com/test.json",
    "cron": "* *//*10 * * * * * *",
    "params": {
        "key1": "value1",
        "key2": "value2"
    }
};
var job = agenda.create('http-notify', task);
job.repeatEvery(task.cron);
job.save(console.log);*/


//agenda.start();

app.listen(3000);
//app.set('port', process.env.PORT || 3000);
console.log('Express server listening on port 3000');

