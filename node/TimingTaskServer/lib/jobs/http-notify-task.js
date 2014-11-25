var Request = require('request'),
    Config = require('../config'),
    Log = require('../log')


module.exports = function(agenda) {

    agenda.define('http-notify', function(job, done) {
        // TODO do something
        var task = job.attrs.data;
        var url = task.notify_url;




    });

};


function _httpGet(url, notify_id, auth, times, maxTryTimes, callback) {
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
                return _httpGet(url, notify_id, auth, times + 1, maxTryTimes, callback);
            } else {
                return callback('CONNECT_TIMEOUT');
            }
        }

        if (res.statusCode == 200) {
            // TODO save notify
        } else {
            // TODO save notify
        }
    };

    Request.get({
        url : url,
        auth : {
            user : auth.user,
            pass : auth.pass
        },
        headers : headers,
        timeout : Config.requestConfig.readTimeout
    }, _callback);

}


//_httpGet("http://www.baidu.com", '123', {user:'xiezefan', pass:'222222'}, 1, 3, console.log);