var Date = require('./DateUtil');
/**
 * Created by xiezefan-pc on 14-9-25.
 */
function _getRandomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/* extend start */
var extend,
    _extend,
    _isObject;

_isObject = function(o){
    return Object.prototype.toString.call(o) === '[object Object]';
}

_extend = function self(destination, source) {
    var property;
    for (property in destination) {
        if (destination.hasOwnProperty(property)) {

            // 若destination[property]和sourc[property]都是对象，则递归
            if (_isObject(destination[property]) && _isObject(source[property])) {
                self(destination[property], source[property]);
            };

            // 若sourc[property]已存在，则跳过
            if (source.hasOwnProperty(property)) {
                continue;
            } else {
                source[property] = destination[property];
            }
        }
    }
};

extend = function(){
    var arr = arguments,
        result = {},
        i;

    if (!arr.length) return {};

    for (i = arr.length - 1; i >= 0; i--) {
        if (_isObject(arr[i])) {
            _extend(arr[i], result);
        };
    }

    arr[0] = result;
    return result;
};



exports.formatDate = function(pattern) {
    return new Date().format(pattern);
};
exports.extend = extend;
exports.randomString = _getRandomString;