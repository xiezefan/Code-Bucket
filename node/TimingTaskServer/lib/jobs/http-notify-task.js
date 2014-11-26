var Request = require('request'),
    Config = require('../config'),
    Log = require('../log'),
    Notify = require('./models/Notify'),
    Tool = require('../common/ToolUtil.js');


module.exports = function(agenda) {

    agenda.define('http-notify', function(job, done) {
        // TODO do something
        var arr = {
            title : "",
            notify_url : "",
            cron : "",
            params : {
                key : 'value',
                key2 : 'value2'
            }
        };
        var task = job.attrs.data;

        var notify = new Notify({
            title : task.title,
            notify_url : task.notify_url,
            params : task.params,
            status : 'SUCCESS'
        });

        notify.save(function(err, notify) {
            if (err) {
                return Log.error('[http-notify-task]' + err);
            }

            var _params = Tool.extend({notify_id:notify._id}, notify.params);
            var content = JSON.stringify(_params);

            _httpPost(notify.notify_url,
                notify.id,
                content,
                {user:task.id, pass:task.mastersecret},
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

};


function _httpPost(url, notify_id, body, auth, times, maxTryTimes, callback) {
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

}
