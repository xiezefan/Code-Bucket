var Mission = require('../models/mission');

function Spider(options) {
    this.options = options;
}

/**
 * 注册监听更新事件
 * @param sid
 * @param cid
 * @param bookName
 * @param callback
 */
function register(sid, cid, bookName, callback) {
    var _options = this.options;
    Mission.findOne({where:{cid:cid}}, function(err, mission) {
        if (err) return callback(err);

        if (mission) {
            callback(null, mission);
        } else {
            _options.search(bookName, function(err, data){
                if (err) {
                    return callback(err);
                }
                var mission = new Mission();
                mission.website = _options.website;
                mission.bookId = data.book_id;
                mission.sid = sid;
                mission.cid = cid;
                mission.save(function(err, mission) {
                    if (err) return callback(err);
                    callback(null, mission);
                });

            });
        }

    });
}


/**
 * 执行定时任务
 */
function executeTask() {
    var _options = this.options;
    console.log(_options.website + " Spider Task Execute");
    Mission.all({where:{website:this.options.website}}, function(err, missions) {
        if (err) return console.log("[executeTask] " + err);

        var length = missions.length;
        while(length--) {
            var mission = missions[length];
            _options.getLastChapter(mission, function(err, mission, lastChapter) {
                if (err) return console.log("[executeTask] " + err);
                if (lastChapter.title != mission.lastChapter) {
                    _options.notify(mission, lastChapter);
                }
            });
        }

    });
}


Spider.prototype.register = register;
Spider.prototype.executeTask = executeTask;
module.exports = Spider;

