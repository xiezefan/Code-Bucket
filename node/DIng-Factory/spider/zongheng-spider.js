var request = require('request');
var cheerio = require('cheerio');
var ddHelper = require('../common/dingdong-helper');
var Mission = require('../models/mission');
var Spider = require('./lastchapter-spider');


var URL_BOOK_SEARCH = "http://wap.zongheng.com/search?field=all&keywords={bookName}";
var URL_BOOK_LINK = "http://wap.zongheng.com/book?bookid={bookId}";
var URL_BOOK_COVER_PIC = "http://static.zongheng.com/v2013/images/logo.gif";
var WEBSITE = "zongheng";

/**
 * 搜索获取BookId
 * @param bookName
 * @param callback
 */
function search(bookName, callback) {
    request.get({
        url : URL_BOOK_SEARCH.replace("{bookName}", bookName)
    }, function(err, rsp, data) {
        if (err) {
            callback(err);
        }
        var $ = cheerio.load(data);
        var searchName;
        var bookId;
        $('.dashline a').each(function(i, elem) {
            var _name = $(elem).text().trim();
            if (_name == bookName) {
                var _bookId = $(elem).attr('href');
                if (_bookId) {
                    _bookId = _bookId.split('=');
                    if (_bookId.length == 2) {
                        bookId = _bookId[1];
                        searchName = _name;
                    }
                }
            }
        });

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
        url : URL_BOOK_LINK.replace("{bookId}", mission.bookId)
    }, function(err, rsp, data) {
        if (err) {
            callback(err);
        } else {
            var $ = cheerio.load(data);
            var lastChapter = $('.bgray a').text();
            if (lastChapter) {
                callback(null, mission, {title:lastChapter.replace('更多>>', '').trim()});
            } else {
                callback("Get ID=" + mission.bookId + " last chapter fail");
            }

        }
    });
}


function notify(mission, lastChapter) {
    ddHelper.pushImage({
        sid:mission.sid,
        cid:mission.cid,
        title:lastChapter.title,
        cover_pic:URL_BOOK_COVER_PIC,
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
