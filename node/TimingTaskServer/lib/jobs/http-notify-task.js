module.exports = function(agenda) {
    var Log = require('../log'),
        async = require('async'),
        httpNotify = require('./http-notify');;

    agenda.jobs({}, function(err, jobs) {
        if (jobs && jobs.length > 0) {
            async.each(jobs, function(job) {
                agenda.define(job.attrs.name, httpNotify);
            }, function(err) {
                Log.error('[http-notify-task]' + err);
            });
        }
    });

    Log.debug('Agenda Running');
};



