/**
 * 循环任务
 * Created by xiezefan-pc on 14-11-20.
 */
var Config = require('../../config');
var redis = require('redis');
var Util = require('../../common/util');
var client = redis.createClient(Config.redis.port, Config.redis.host);

var key = {
    main : 'h:timer.loop_task:{id}',
    interval : 's:timer.loop_task.interval:{interval}',
    interval_list : 's:timer.loop_task.interval.list'
};

function LoopTask(options) {
    var _options = Util.extend({}, options);
    this.id =_options.id;
    this.interval = _options.interval;
    this.notify_url = _options.notify_url;
    this.title = _options.title;
}

LoopTask.prototype.save = function(done) {
    if (!done) done = _callback;
    var obj = this;
    var saveMap = {};
    for(var p in obj){
        if(obj[p] != undefined && typeof(obj[p]) != 'function'){
            saveMap[p] = obj[p];
        }
    }
    client.hmset(key.main.replace('{id}', this.id), saveMap, function(err) {
        if (err) return done(err);
        client.sadd(key.interval.replace('{interval}', saveMap.interval), saveMap.id, function(err) {
            if (err) return done(err);
            client.sadd(key.interval_list, saveMap.interval, function(err) {
                if (err) return done(err);
                done(null, obj);
            });
        });
    });
};

LoopTask.findOne = function(id, done) {
    if (!done) done = _callback;
    var loopTaskKey = key.main.replace('{id}', id);
    client.exists(loopTaskKey, function(err, exist) {
        if (err) return done(err);
        if (exist) {
            client.hgetall(loopTaskKey, function(err, dataMap) {
                if (err) return done(err);
                return new done(err, new LoopTask(dataMap));
            });
        } else {
            return done(null, null);
        }
    });
};

LoopTask.findTaskByInterval = function(interval, done) {
    if (!done) done = _callback;

    var intervalKey = key.interval.replace('{interval}', interval);
    client.exists(intervalKey, function(err, exist) {
        if (err) return done(err);

        if (exist) {
            client.smembers(intervalKey, done);
        } else {
            return done(null, null);
        }
    });
};

LoopTask.findIntervals = function(done) {
    if (!done) done = _callback;

    client.exists(key.interval_list, function(err, exist) {
        if (err) return done(err);

        if (exist) {
            client.smembers(key.interval_list, done);
        } else {
            return done(null, null);
        }
    });
};


// auto callback
function _callback() {}
