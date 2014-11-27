var express = require('express');
var router = express.Router();
var Log = require('../log');
var agenda = require('../agenda');
var Config = require('../config');
var Tool = require('../common/ToolUtil');
var httpNotify = require('../jobs/http-notify');

// create task
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
    }, function(err, task) {
        res.json({code:3001, content:task});
    })

});

// update task
router.put('/:id', function(req, res) {
    var reqData = req.body;

    Log.debug('POST /task/%s %s', req.params.id, JSON.stringify(reqData));

    updateTask(req.params.id, reqData, function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json({code:3000, content:"success"});
        }
    });
});

// pause task
router.post('/:id/pause', function(req, res) {
    Log.debug('POST /task/%s/pause %s', req.params.id);

    agenda.jobs({name:'http-notify-' + req.params.id}, function(err, jobs) {
        if (err) return res.status(400).send(err);

        if (jobs && jobs.length > 0) {
            var job = jobs[0];
            job.attrs.data['pause'] = true;
            agenda.saveJob(job);
            res.json({code:3000, content:"success"});
        } else {
            res.status(400).send('TASK_NOT_FOUND');
        }
    });
});

// run task
router.post('/:id/run', function(req, res) {
    Log.debug('POST /task/%s/run %s', req.params.id);

    agenda.jobs({name:'http-notify-' + req.params.id}, function(err, jobs) {
        if (err) return res.status(400).send(err);

        if (jobs && jobs.length > 0) {
            var job = jobs[0];
            job.attrs.data['pause'] = false;
            agenda.saveJob(job);
            res.json({code:3000, content:"success"});
        } else {
            res.status(400).send('TASK_NOT_FOUND');
        }
    });
});

// execute task
router.post('/:id/execute', function(req, res) {
    Log.debug('POST /task/%s/execute %s', req.params.id);

    agenda.jobs({name:'http-notify-' + req.params.id}, function(err, jobs) {
        if (err) return res.status(400).send(err);

        if (jobs && jobs.length > 0) {
            var job = jobs[0];
            agenda.now(job.attrs.name, job.attrs.data);
            res.json({code:3000, content:"success"});
        } else {
            res.status(400).send('TASK_NOT_FOUND');
        }
    });

});

// delete task
router.delete('/:id', function(req, res) {
    Log.debug('DELETE /task/%s %s', req.params.id);

    agenda.cancel({name:'http-notify-' + req.params.id}, function(err, numRemoved) {
        if (err) res.status(400).send('Bad Request');
        res.json({code:3000, content:"success"});
    });
});

function updateTask(id, params, done) {
    agenda.jobs({name:'http-notify-' + id}, function(err, jobs) {
        if (err) return done(err);

        if (jobs && jobs.length > 0) {
            var job = jobs[0];
            job.attrs.data = Tool.extend(job.attrs.data, params);
            job.attrs.repeatInterval = params.cron;
            agenda.saveJob(job);
            done(err)
        } else {
            return done('TASK_NOT_FOUND');
        }
    });

}


function registerTask(task, done) {
    var job = agenda.create('http-notify-' + task.id, task);
    job.repeatEvery(task.cron);

    job.save(function(err) {
        if (err) return done(err);
        Log.debug('Task ' + task.title + ' save success.');
        done(err, task);
    });

    agenda.define('http-notify-' + task.id, httpNotify);
}

module.exports = router;