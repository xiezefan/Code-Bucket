var SERVER_HOST = "127.0.0.1";
//var SERVER_HOST = "192.168.248.124";
var SERVER_PORT = "10015";
var SERVER_VERSION = "ding-server/v1";
var SERVER_BASE = "http://" + SERVER_HOST + ":" + SERVER_PORT + "/" + SERVER_VERSION;


var config = {
    redis : {
        port : 16383,
        host : '127.0.0.1'
    },
    server : {
        host : SERVER_HOST,
        port : SERVER_PORT,
        version : SERVER_VERSION,
        basePath : SERVER_BASE,
        pushPath : SERVER_BASE + "/service/{sid}/{cid}/push"
    }
};

module.exports = config;
