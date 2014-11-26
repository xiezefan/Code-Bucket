var express = require('express');
var router = express.Router();
var Log = require('../log');
var Agenda = require('agenda');
var Config = require('../config');
var Tool = require('../common/ToolUtil');

var agenda = new Agenda(Config.agendaConfig);

router.post('/', function(req, res) {
    var reqData = req.body;


    Log.debug('POST /task ' + JSON.stringify(reqData));

    if (!reqData || !reqData.title || !reqData.notify_url || !reqData.cron) {
        return res.status(400).send('Bad Request');
    }

    registerTask({
        id:Tool.rundomStr(24),
        title:reqData.title,
        notify_url:reqData.notify_url,
        cron:reqData.cron,
        params:reqData.params,
        masterSecret:Tool.rundomStr(24)
    }, function() {
        res.json({code:3000, content:"success"});
    })

});


function registerTask(task, done) {
    var job = agenda.create('http-notify', task);
    job.repeatEvery(task.cron);
    job.save(function(err) {
        if (err) return done(err);
        Log.debug('Task ' + task.title + ' save success.');
        if (done) return done();
    });
}


module.exports = router;