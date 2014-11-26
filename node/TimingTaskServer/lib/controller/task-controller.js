var express = require('express');
var router = express.Router();
var Log = require('../log');
var agenda = require('../agenda');



router.post('/', function(req, res) {
    var reqData = req.body;


    Log.debug('POST /task ' + JSON.stringify(reqData));

    if (!reqData || !reqData.title || !reqData.notify_url || !reqData.cron) {
        return res.status(400).send('Bad Request');
    }

    registerTask({
        title:reqData.title,
        notify_url:reqData.notify_url,
        cron:reqData.cron,
        params:reqData.params
    }, function() {
        res.json({code:3000, content:"success"});
    })

});


function registerTask(task, done) {
    var job = agenda.create('http-notify', task);
    job.repeatEvery(task.cron);
    job.save(function(err) {
        if (err) return done(err);
        Log.debug('Task ' + JSON.stringify(task) + ' save success.');
        if (done) return done();
    });
}


module.exports = router;