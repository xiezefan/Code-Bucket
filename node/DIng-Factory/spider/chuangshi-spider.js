var request = require('request');
var ddHelper = require('../common/dingdong-helper');
var Mission = require('../models/mission');
var Spider = require('./lastchapter-spider');


var URL_BOOK_SEARCH = "http://ubook.3g.qq.com/5/search?key={bookName}";
var URL_BOOK_LINK = "http://ubook.qq.com/5/intro.html?bid={bookId}";
var URL_BOOK_LAST_CHAPTER = "http://ubook.3g.qq.com/6/intro?bid={bookId}";
var URL_BOOK_COVER_PIC = "http://wfqqreader.3g.qq.com/cover/735/{bookId}/m_{bookId}.jpg";
var WEBSITE = "chuangshi";


/**
 * 搜索获取BookId
 * @param bookName
 * @param callback
 */
function search(bookName, callback) {
    request.get({
        url : URL_BOOK_SEARCH.replace("{bookName}", bookName)
    }, function(err, rsp, data) {
        if (err) return callback(err);

        var body;
        try {
            body = JSON.parse(data);
        } catch (e) {
            return callback("Invalid HTTP Response " +data);
        }

        var searchName;
        var bookId;

        if (body && body.hasResult && body.booklist && body.booklist.length > 0) {
            var book = body.booklist[0];
            if (book && book.title) {
                var title = book.title;
                title = title.replace(/<b>/g, '').replace(/<\/b>/g, '');
                if (title == bookName) {
                    searchName = title;
                    bookId = book.id;
                }
            }
        }

        if (searchName && bookId) {
            callback(null, {book_id:bookId, book_name:searchName});
        } else {
            callback('Book Not Found');
        }
    });
}

/**
 * 获取最新章节
 * @param mission
 * @param callback
 */
function getLastChapter(mission, callback) {
    request.get({
        url : URL_BOOK_LAST_CHAPTER.replace("{bookId}", mission.bookId)
    }, function(err, rsp, data) {
        if (err) {
            callback(err);
        } else {
            var body;
            try {
                body = JSON.parse(data);
            } catch (e) {
                callback("Invalid HTTP Response " + data);
            }
            var lastChapter;
            if (body && body.book && body.book.lastChapterName) {
                lastChapter = body.book.lastChapterName;
            }

            if (lastChapter) {
                callback(null, mission, {title:lastChapter});
            } else {
                callback("Get ID=" + mission.bookId + " last chapter fail");
            }

        }
    });
}

/**
 * 注册监听更新事件
 * @param sid
 * @param cid
 * @param bookName
 * @param callback
 */
function register(sid, cid, bookName, callback) {
    Mission.findOne({where:{cid:cid}}, function(err, mission) {
        if (err) return callback(err);

        if (mission) {
            callback(null, mission);
        } else {
            search(bookName, function(err, data){
                if (err) {
                    return callback(err);
                }
                var mission = new Mission();
                mission.website = WEBSITE;
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



function notify(mission, lastChapter) {
    ddHelper.pushImage({
        sid:mission.sid,
        cid:mission.cid,
        title:lastChapter.title,
        cover_pic:URL_BOOK_COVER_PIC.replace("{bookId}", mission.bookId).replace("{bookId}", mission.bookId),
        link:URL_BOOK_LINK.replace("{bookId}", mission.bookId)
    }, function(err) {
        if (err) return console.log("Push Fail, " + err);
        mission.updateAttribute('lastChapter', lastChapter.title, function(err) {
            if (err) return console.log("Update DB Fail, "  + err);
            console.log("Push Success. Mission:" + JSON.stringify(mission));
        });
    });
}


var spider = new Spider({
    website:WEBSITE,
    search:search,
    getLastChapter:getLastChapter,
    notify:notify
});

module.exports = spider;
