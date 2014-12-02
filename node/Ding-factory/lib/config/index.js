var SERVER_BASE = "http://demo.thering.cn/ding-server/v1";

var config = {
    mongodb : {
        host : 'mongodb://127.0.0.1:27017/node-factory'
    },
    dingService : {
        pushPath : SERVER_BASE + "/service/{sid}/{cid}/push"
    },
    log : {
        savePath : '/home/xiezefan-pc/code/xiezefan/Code-Bucket/node/Spider-Factory/logs/spider-factory.log'
        //savePath : '/home/xiezf/node/Ding-factory/logs/spider-factory.log'

    }
};

module.exports = config;