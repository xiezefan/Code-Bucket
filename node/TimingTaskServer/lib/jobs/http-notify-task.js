module.exports = function(agenda) {
    var Request = require('request'),
        Config = require('../config'),
        Log = require('../log'),
        Notify = require('./models/Notify'),
        Tool = require('../common/ToolUtil');

    var d = require('domain').create();
    d.on('error', function(err) {
        Log.error('[http-notify-task][domain]', err.message);
    });

    var _httpPost = function(url, notify_id, body, auth, times, maxTryTimes, callback) {
        console.log('HTTP GET - [id:%s, url:%s, times:%s/%s]', notify_id, url, times, maxTryTimes);
        var headers = {
            'User-Agent' : 'Timing Task Server',
            'Connection' : 'Keep-Alive',
            'Charset' : 'UTF-8',
            'Content-Type' : 'application/json'
        };

        var _callback = function(err, res, body) {
            if (err) {
                if (err.code == 'ETIMEDOUT' && err.syscall != 'connect') {
                    // response timeout
                    return callback('RESPONSE_TIMEOUT');
                } else if (err.code == 'ENOTFOUND') {
                    // unknown host
                    return callback('UNKNOWN_HOST');
                }
                // other connection error
                if (times < maxTryTimes) {
                    return _httpPost(url, notify_id, auth, times + 1, maxTryTimes, callback);
                } else {
                    return callback('CONNECT_TIMEOUT');
                }
            }

            if (res.statusCode == 200) {
                return callback(null, 'success');
            } else {
                return callback(res.body);
            }
        };

        Request.post({
            url : url,
            body : body,
            auth : {
                user : auth.user,
                pass : auth.pass
            },
            headers : headers,
            timeout : Config.requestConfig.readTimeout
        }, _callback);

    };

    agenda.define('http-notify', function(job, done) {

        var task = job.attrs.data;

        var notify = new Notify({
            title : task.title,
            notify_url : task.notify_url,
            params : task.params,
            status : 'SUCCESS'
        });

        d.run(function() {
            notify.save(function(err, notify) {
                if (err) {
                    return Log.error('[http-notify-task]' + err);
                }

                var _params = Tool.extend({notify_id:notify._id}, notify.params);
                var content = JSON.stringify(_params);

                _httpPost(notify.notify_url,
                    notify._id,
                    content,
                    {user:task.id, pass:task.masterSecret},
                    1,
                    Config.requestConfig.retryTimes,
                    function(err) {
                        if (err) {
                            return Log.error('[http-notify-task]' + err + ', notify:' + JSON.stringify(notify));
                        }
                        done();
                    });
            });
        });


    });

    Log.debug('Agenda Running');

};



