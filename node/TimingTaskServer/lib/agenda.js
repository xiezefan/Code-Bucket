var Agenda = require('agenda');
var Config = require('./config')

var agenda = new Agenda(Config.agendaConfig);


var jobTypes = Config.jobs instanceof Array ? Config.jobs : [];

jobTypes.forEach(function(type) {
    require('./lib/jobs/' + type)(agenda);
});

if(jobTypes.length) {
    agenda.start();
}

module.exports = agenda;