var Request = require('request'),
    Config = require('../config'),
    Log4js = require('log4js');

Log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/http-notify.log',
            maxLogSize: 1024,
            backups:3,
            category: '[http-notify]'
        }
    ]
});

module.exports = function(agenda) {

    agenda.define('http-notify', function(job, done) {
        // TODO do something
        var task = job.attrs.data;
        var url = task.notify_url;
        var headers = {
            'User-Agent' : 'Timing Task Server',
            'Connection' : 'Keep-Alive',
            'Charset' : 'UTF-8',
            'Content-Type' : 'application/json'
        };        Request.get({
            url : url,
            auth : {
                user : task.id,
                pass : task.mastersecret
            },
            headers : headers,
            timeout : Config.requestConfig.readTimeout
        }, null);
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
}

function _request(url, body, headers, auth, method, times, maxTryTimes, callback) {
    console.log("Push URL :" + url);
    if (body)
        console.log("Body :" + body);
    console.log("Headers :" + JSON.stringify(headers));
    // console.log("Auth :" + JSON.stringify(auth));
    console.log("Method :" + method);
    console.log("Times/MaxTryTimes : " + times + "/" + maxTryTimes);

    var _callback = function(err, res, body) {
        if (err) {
            if (err.code == 'ETIMEDOUT' && err.syscall != 'connect') {
                // response timeout
                return callback(new JError.APIConnectionError(
                    'Response timeout. Your request to the server may have already received, please check whether or not to push',
                    true));
            } else if (err.code == 'ENOTFOUND') {
                // unknown host
                return callback(new JError.APIConnectionError('Known host : '
                    + url));
            }
            // other connection error
            if (times < maxTryTimes) {
                return _request(url, body, headers, auth, method, times + 1,
                    maxTryTimes, callback);
            } else {
                return callback(new JError.APIConnectionError(
                    'Connect timeout. Please retry later.'));
            }
        }
        if (res.statusCode == 200) {
            if (body.length != 0) {
                console.log("Push Success, response : " + body)
                return callback(null, eval('(' + body + ')'));
            } else {
                console.log("Push Success, response : " + body)
                return callback(null, 200);
            }
        } else {
            console.log("Push Fail, HttpStatusCode: " + res.statusCode
                + " result: " + body.toString());
            callback(new JError.APIRequestError(res.statusCode, body));
        }
    };

    if (method == 'POST' || method == 'post') {
        Request.post({
            url : url,
            body : body,
            auth : {
                user : auth.user,
                pass : auth.pass
            },
            headers : headers,
            timeout : READ_TIMEOUT
        }, _callback);
    }
    if (method == 'GET' || method == 'get') {
        Request.get({
            url : url,
            body : body,
            auth : {
                user : auth.user,
                pass : auth.pass
            },
            headers : headers,
            timeout : READ_TIMEOUT
        }, _callback);
    }

    if (method == 'DELETE' || method == 'delete') {
        Request.del({
            url : url,
            body : body,
            auth : {
                user : auth.user,
                pass : auth.pass
            },
            headers : headers,
            timeout : READ_TIMEOUT
        }, _callback);
    }
}