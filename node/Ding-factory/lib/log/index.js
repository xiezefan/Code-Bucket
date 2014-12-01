var bunyan = require('bunyan'),
    Config = require('../config');

module.exports = function(name) {
    return bunyan.createLogger({
        name: name,
        streams: [
            {
                stream: process.stderr,
                level: "debug"
            },
            {
                level: "debug",
                type: 'rotating-file',
                path: Config.log.savePath,
                period: '1d',   // daily rotation
                count: 10        // keep 3 back copies
            }
        ]
    });
};