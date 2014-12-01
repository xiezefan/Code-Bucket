var request = require('request');
var cheerio = require('cheerio');
var ddHelper = require('../common/dingdong-helper');
var Spider = require('./lastchapter-spider');

var URL_BOOK_SEARCH = "http://dingdong-node-spider.soku.com/m/t/video?q={bookName}";

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
        var _name = $('.yk-box .v-title ').first().find('.highlight').text().trim();
        if (_name == bookName) {
            var _bookId = $('.yk-box .v-title a').attr('href');
            console.log(_bookId);
            if (_bookId) {
                _bookId = _bookId.split('/');
                if (_bookId.length > 0) {
                    _bookId = _bookId[_bookId.length - 1];
                    bookId = _bookId.split('.')[0];
                    searchName = _name;
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

search("火影忍者", console.log);