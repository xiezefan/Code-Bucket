var request = require('request');
var cheerio = require('cheerio');
var ddHelper = require('../common/dingdong-helper');
var Mission = require('../models/mission');
var Spider = require('./lastchapter-spider');

var URL_BOOK_SEARCH = "http://m.u17.com/comic/search?key={bookName}&page=1";
var URL_BOOK_LINK = "http://m.u17.com/c/{bookId}.html";
var WEBSITE = "u17";
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
        $('.search_result_box').each(function(i, elem) {
            var _name = $(elem).find('.title_name').text().trim();
            if (_name == bookName) {
                var _bookId = $(elem).find('a').attr('href');
                if (_bookId) {
                    _bookId = _bookId.split('/');
                    if (_bookId.length == 3) {
                        _bookId = _bookId[2].split(".");
                        if (_bookId.length == 2) {
                            bookId = _bookId[0];
                            searchName = _name;
                        }
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
            var lastChapter = $('.comic_list_con li').last().text();
            if (lastChapter) {
                var cover_pic = $('.list_h img').attr('src').trim();
                callback(null, mission, {title:lastChapter.trim().split("\n")[0].trim(), coverPic:cover_pic});
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
        cover_pic:lastChapter.coverPic,
        link:URL_BOOK_LINK.replace("{bookId}", mission.bookId)
    }, function(err) {
        if (err) return console.log("Push Fail, " + err);
        mission.updateAttribute('lastChapter', lastChapter.title, function(err, mission) {
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