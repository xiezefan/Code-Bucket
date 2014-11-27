var express = require('express');
var router = express.Router();
var Log = require('../log');
var agenda = require('../agenda');
var Config = require('../config');
var Tool = require('../common/ToolUtil');
var httpNotify = require('../jobs/http-notify');

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

router.put('/:id', function(req, res) {
    var reqData = req.body;

    Log.debug('POST /task/%s %s', req.params.id, JSON.stringify(reqData));

    reqData['_id'] = req.params.id;

    res.json({code:3000, content:"success"});
});

function updateTask(task, done) {

}


function registerTask(task, done) {
    var job = agenda.create('http-notify-' + task.id, task);
    job.repeatEvery(task.cron);

    job.save(function(err) {
        if (err) return done(err);
        Log.debug('Task ' + task.title + ' save success.');
        done(err);
    });

    agenda.define('http-notify-' + task.id, httpNotify);
}

module.exports = router;