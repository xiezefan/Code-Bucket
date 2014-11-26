var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var multer = require('multer');

var Config = require('./lib/config');

var taskController = require('./lib/controller/task-controller');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use('/task/', taskController);

app.listen(Config.serverConfig.port, function() {
    console.log('Server running in ' + Config.serverConfig.port);
});