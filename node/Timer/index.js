var express = require('express');
var Agenda = require('agenda');
var agendaUI = require('agenda-ui');

var app = express();
var agenda = new Agenda({db: { address: 'localhost:27017/agenda-example'}})

app.use('/agenda-ui', agendaUI(agenda, {poll: 1000}));

agenda.define('job_test1', function(job, done) {
    console.log("EXECUTE:" + JSON.stringify(job));
    done();
});

agenda.every('*/10 * * * * * * *', 'job_test1');


agenda.start();

app.listen(3000);
app.set('port', process.env.PORT || 3000);
console.log('Express server listening on port 3000');

