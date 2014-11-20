var express = require('express');
var Agenda = require('agenda');
var agendaUI = require('agenda-ui');

var app = express();
var agenda = new Agenda({db: { address: 'localhost:27017/agenda-example'}})

app.use('/agenda-ui', agendaUI(agenda, {poll: 1000}));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
