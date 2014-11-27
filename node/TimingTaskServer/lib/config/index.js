var config = {
    // 任务列表
    jobs : ['http-notify-task'],
    agendaConfig : {
        // mongodb 配置
        db: {
            address: '127.0.0.1:27017/timing-task-server',
            collection: 'notifyJobs19'
        },
        // 最大同时执行任务
        maxConcurrency: 20,
        // 默认同时执行任务
        defaultConcurrency: 5,
        // 默认最长响应时间
        defaultLockLifetime: 10000
    },
    requestConfig : {
        readTimeout : 300000,
        retryTimes : 3,
        tempAppKey : 'jzkmrgnfudihwopxyasvcqbe',
        tempMasterSecret : 'lukvmhdsxrnbiyqzcgjtwpea'
    },
    logConfig : {
        // 日志保存路径
        logSavePath : '/home/xiezefan-pc/code/xiezefan/Code-Bucket/node/TimingTaskServer/logs/timing-task-server.log'
    },
    serverConfig : {
        port : '3000'
    }
};

module.exports = config;