var bunyan = require('bunyan'),
    Config = require('../config');

module.exports = bunyan.createLogger({
    name: 'TimingTaskServer',
    streams: [
        {
            stream: process.stderr,
            level: "debug"
        },
        {
            level: "debug",
            type: 'rotating-file',
            path: Config.logConfig.logSavePath,
            period: '1d',   // daily rotation
            count: 10        // keep 3 back copies
        }
    ]
});

