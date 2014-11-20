/**
 * 服务器配置信息
 * @type {{redis: {port: number, host: string}}}
 */

var config = {
    redis : {
        port : 16383,
        host : '127.0.0.1'
    }
};

module.exports = config;
