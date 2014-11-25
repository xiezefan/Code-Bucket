var bunyan = require('bunyan'),
    Config = require('../config');

module.exports = bunyan.createLogger({
    name: 'TimingTaskServer',
    streams: [{
        type: 'rotating-file',
        path: Config.logConfig.logSavePath,
        period: '1d',   // daily rotation
        count: 10        // keep 3 back copies
    }]
});

