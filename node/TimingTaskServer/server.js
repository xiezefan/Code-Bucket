var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var Config = require('./lib/config');
var Log = require('./lib/log');

var agendaUI = require('agenda-ui');
var Agenda = require('agenda');

var taskController = require('./lib/controller/task-controller');
//var httpNotifyTask = require('./lib/jobs/http-notify-task');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.get('/', function(req, res){
    res.send('hello world');
});


app.use('/task/', taskController);


var agenda = new Agenda(Config.agendaConfig);


app.use('/agenda-ui', agendaUI(agenda, {poll: 1000}));

require('./lib/jobs/http-notify-task')(agenda);

//require('./loadTest')(agenda);

agenda.start();

app.listen(Config.serverConfig.port);

console.log('Express server listening on port 3000');