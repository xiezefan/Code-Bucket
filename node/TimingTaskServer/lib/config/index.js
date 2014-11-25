var config = {
    // 任务列表
    jobs : ['http-notify-task'],
    agendaConfig : {
        // mongodb 配置
        db: {
            address: 'localhost:27017/agenda-example',
            collection: 'notifyJobs'
        },
        // 最大同时执行任务
        maxConcurrency: 20,
        // 默认同时执行任务
        defaultConcurrency: 5,
        // 默认最长响应时间
        defaultLockLifetime: 10000
    },
    requestConfig : {
        readTimeout : 30,
        tempAppKey : 'jzkmrgnfudihwopxyasvcqbe',
        tempMasterSecret : 'lukvmhdsxrnbiyqzcgjtwpea'
    }
};

module.exports = config;