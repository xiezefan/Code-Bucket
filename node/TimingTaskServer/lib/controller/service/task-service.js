var Tool = require('../../common/ToolUtil');
var log = require('../../log');
var async = require('async');
var httpNotify = require('../../jobs/http-notify');


var TaskService = module.exports = function (agenda) {
    this.agenda = agenda;
    this.db = agenda._db;
};

TaskService.prototype.save = function(task, done) {
    if (!task || !task.title || !task.notify_url || !task.cron) {
        return done('INVADE PARAMS');
    }

    task['id'] = Tool.rundomStr(24);
    task['masterSecret'] = Tool.rundomStr(24);

    var job = this.agenda.create('http-notify-' + task.id, task);
    job.repeatEvery(task.cron);

    // save
    job.save(function(err) {
        if (err) return done(err);
        log.debug('Task ' + task.title + ' save success.');
        done(err, task);
    });

    // run task
    this.agenda.define('http-notify-' + task.id, httpNotify);
};

TaskService.prototype.update = function(id, task, done) {
    var self = this;
    async.waterfall([
        function(callback) {
            self.findOne(id, callback);
        },
        function(job, callback) {
            if (job && job.attrs) {
                job.attrs.data = Tool.extend(job.attrs.data, task);
                job.attrs.repeatInterval = task.cron;
                self.agenda.saveJob(job, callback);
            } else {
                callback('INVALID JOBS');
            }
        }
    ], done);
};

TaskService.prototype.findOne = function(id, done) {
    this.agenda.jobs({name:'http-notify-' + id}, function(err, jobs) {
        if (err) return done(err);

        if (jobs && jobs.length > 0) {
            done(err, jobs[0])
        } else {
            return done('TASK_NOT_FOUND');
        }
    });
};

TaskService.prototype.remove = function(id, done) {
    var self = this;
    async.waterfall([
        function(callback) {
            self.findOne(id, callback);
        },
        function(job, callback) {
            if (job && job.attrs && job.attrs.name) {
                self.agenda.cancel({name:job.attrs.name}, callback);
            } else {
                callback('INVALID JOBS');
            }
        }
    ], done);
};

TaskService.prototype.execute = function(id, done) {
    var self = this;

    async.waterfall([
        function(callback) {
            self.findOne(id, callback);
        },
        function(job, callback) {
            if (job && job.attrs && job.attrs.name) {
                self.agenda.now(job.attrs.name, job.attrs.data);
                callback(null);
            } else {
                callback('INVALID JOBS');
            }
        }
    ], done);
};

TaskService.prototype.pause = function(id, done) {
    var self = this;

    async.waterfall([
        function(callback) {
            self.findOne(id, callback);
        },
        function(job, callback) {
            if (job && job.attrs) {
                if (job.attrs.data) {
                    job.attrs.data['pause'] = true;
                } else {
                    job.attrs.data = {pause:true};
                }
                self.agenda.saveJob(job, callback);
            } else {
                callback('INVALID JOBS');
            }
        }
    ], done);
};

TaskService.prototype.run = function(id, done) {
    var self = this;
    async.waterfall([
        function(callback) {
            self.findOne(id, callback);
        },
        function(job, callback) {
            if (job && job.attrs) {
                if (job.attrs.data) {
                    job.attrs.data['pause'] = false;
                } else {
                    job.attrs.data = {pause:false};
                }
                self.agenda.saveJob(job, callback);
            } else {
                callback('INVALID JOBS');
            }
        }
    ], done);
};


