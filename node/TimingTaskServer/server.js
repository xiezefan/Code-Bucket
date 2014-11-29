var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var Config = require('./lib/config');

var agendaUI = require('./lib/agenda-ui');
var agenda = require('./lib/agenda');

var taskController = require('./lib/controller/task-controller');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.use('/task/', taskController);
app.use('/agenda-ui', agendaUI(agenda, {poll: 10000}));


app.listen(Config.serverConfig.port);
console.log('Express server listening on port 3000');