var express = require('express');
var router = express.Router();
var Log = require('../log');
var agenda = require('../agenda');
var Config = require('../config');

var Task = require('./service/task-service')
var task = new Task(agenda);

function processErr(err, res) {
    if (typeof err == 'string') {
        return res.status(400).send(err);
    }
    return res.status(500).send('Bad Server');
}

// create task
router.post('/', function(req, res) {
    var reqData = req.body;
    Log.debug('POST /task ' + JSON.stringify(reqData));
    task.save(reqData, function(err, job) {
        if (err) return processErr(err, res);
        res.json({code:3001, content:job});
    });
});


// update task
router.put('/:id', function(req, res) {
    var reqData = req.body;
    Log.debug('POST /task/%s %s', req.params.id, JSON.stringify(reqData));

    task.update(req.params.id, reqData, function(err) {
        if (err) return processErr(err, res);
        res.json({code:3000, content:"success"});
    });
});


// pause task
router.post('/:id/pause', function(req, res) {
    Log.debug('POST /task/%s/pause %s', req.params.id);

    task.pause(req.params.id, function(err) {
        if (err) return processErr(err, res);
        res.json({code:3000, content:"success"});
    });
});

// run task
router.post('/:id/run', function(req, res) {
    Log.debug('POST /task/%s/run %s', req.params.id);

    task.run(req.params.id, function(err) {
        if (err) return processErr(err, res);
        res.json({code:3000, content:"success"});
    });
});

// execute task
router.post('/:id/execute', function(req, res) {
    Log.debug('POST /task/%s/execute %s', req.params.id);

    task.execute(req.params.id, function(err) {
        if (err) return processErr(err, res);
        res.json({code:3000, content:"success"});
    });

});

// delete task
router.delete('/:id', function(req, res) {
    Log.debug('DELETE /task/%s %s', req.params.id);

    task.remove(req.params.id, function(err) {
        if (err) return processErr(err, res);
        res.json({code:3000, content:"success"});
    });
});


module.exports = router;