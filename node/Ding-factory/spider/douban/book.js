var request = require('request');
var cheerio = require('cheerio');
var Util = require('../../common/util');
var BookReview = require('../../models/douban/BookReview');
var Server = require('../../models/server');
var ddHelper = require('../../common/dingdong-helper');

var URL_INDEX = "http://book.douban.com";
var URL_BEST_REVIEW_LIST = "http://book.douban.com/review/best/?start={start}";
var URL_REVIEW_LIST = "http://book.douban.com/subject/{bookId}/reviews";
var URL_REVIEW_PAGE = "http://book.douban.com/review/{reviewId}/";
var URL_BOOK_COVER_PIC = "http://img3.douban.com/mpic/s{bookId}.jpg";

var HEADER = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36'
};

/**
 * 获取首页的书评
 */
function indexAnalysis(callback) {
    if (!callback) callback = _callback;

    request.get({
        url : URL_INDEX,
        headers : HEADER
    }, function(err, rsp, data) {
        if (err) return callback(err);
        var $ = cheerio.load(data);
        $('.slide-item li .cover a').each(function(i, elem) {
            var id = $(elem).attr('href');
            if (id) {
                id = id.split('/');
                if (id.length >= 2) {
                    id = id[id.length-2];
                    reviewListAnalysis(id, callback);
                }
            }
        });

        $('.list-summary li .cover a').each(function(i, elem) {
            var id = $(elem).attr('href');
            if (id) {
                id = id.split('/');
                if (id.length >= 2) {
                    id = id[id.length-2];
                    reviewListAnalysis(id, callback);
                }
            }
        });
    });
}

/**
 * 获取 bookId 的书评列表
 * @param bookId
 * @param callback
 */
function reviewListAnalysis(bookId, callback) {
    request.get({
        url : URL_REVIEW_LIST.replace("{bookId}", bookId),
        headers : HEADER
    }, function(err, rsp, data) {
        if (err) return callback(err);
        var $ = cheerio.load(data);

        $('.ctsh .tlst ').each(function(i, elem) {
            var id = $(elem).find('.nlst h3 div').attr('id');
            var reply = $(elem).find('.clst .pl span').first().text();
            if (reply && reply.indexOf('回应') != -1) {
                reply = reply.replace('回应', '');
            }  else {
                reply = '0';
            }
            if (id) {
                id = id.split('-');
                if (id.length > 1) {
                    id = id[id.length - 1];
                    reviewPageAnalysis({id:id, bookId:bookId, reply:reply}, callback);
                }
            }
        });
    });
}

/**
 * 捉取书评页信息
 * @param review
 * @param callback
 */
function reviewPageAnalysis(review, callback) {
    request.get({
        url : URL_REVIEW_PAGE.replace("{reviewId}", review.id),
        headers : HEADER
    }, function(err, rsp, data) {
        if (err) return callback(err);
        var $ = cheerio.load(data);
        var useful = $('#ucount' + review.id + 'u').text().trim();
        var title = $('#content h1').text().trim();
        var book = $('.aside .pl2 a').text().trim();
        var star = $('.article .piir .pl2 span img').attr('alt');
        if (star) {
            star = star.split(' ')[0];
        }
        if (useful && title && book && star) {
            review = Util.extend(review, {
                useful:useful,
                title:title,
                book:book,
                star:star
            });
            var _review = new BookReview(review);

            _review.save(function(err, obj) {
                if (err) return console.log(err);
                if (obj) {
                    console.log('Save Douban Book Review ' + obj.id + ' Success');
                    BookReview.putQueue(obj, function(err) {
                        if (err) return callback(err);
                        callback(null, obj);
                    });
                } else {
                    callback(null, null);
                }
            });
        }
    });
}

/**
 * 获取最佳书评
 * @param callback
 */
function bestReviewAnalysis(callback) {
    if (!callback) callback = _callback;
    for (var i=0; i<5; i++) {
        request.get({
            url : URL_BEST_REVIEW_LIST.replace("{start}", i * 10 + ""),
            headers : HEADER
        }, function(err, rsp, data) {
            if (err) return callback(err);

            var $ = cheerio.load(data);
            $('.tlst').each(function(i, elem) {
                var bookId = $(elem).find('.ilst a').attr('href');
                if (bookId) {
                    bookId = bookId.split('/');
                    if (bookId.length > 2) {
                        bookId = bookId[bookId.length - 2];
                    }
                }

                var reviewId = $(elem).find('.nlst a').attr('href');
                if (reviewId) {
                    reviewId = reviewId.split('/');
                    reviewId = reviewId[reviewId.length - 2];
                }

                var reply = $(elem).find('.clst .pl span').text();
                if (!reply || reply.length < 1) {
                    reply = '0';
                } else {
                    reply = reply.replace('回应', '');
                }

                if (reviewId && bookId) {
                    reviewPageAnalysis({id: reviewId, bookId: bookId, reply:reply}, callback);
                }
            });
        });
    }
}

/**
 * 默认回调
 * @private
 */
function _callback() {}


function pushTask() {
    BookReview.popQueue(function(err, review) {
        if (err) return console.log("[DouBan]Push Task Crash, Error Message : " + err);

        if (!review) return;
        if (review) {
            BookReview.inPushSet(review.id, function(err, inPushSet) {
                if (inPushSet) {
                    pushTask();
                } else {
                    Server.all({where:{module:'douban_book'}}, function(err, servers) {
                        if (err) return console.log(err);
                        if (servers) {
                            var length = servers.length;
                            while(length--) {
                                var server = servers[length];
                                var options = {
                                    sid:server.sid,
                                    cid:server.cid,
                                    title : "《" + review.book + "》" + review.title,
                                    cover_pic : URL_BOOK_COVER_PIC.replace("{bookId}", review.bookId),
                                    link : URL_REVIEW_PAGE.replace("{reviewId}", review.id)
                                };
                                ddHelper.push(options, function(err, body) {
                                    if (err) return console.log(err);
                                    BookReview.addPushSet(review.id, function(err) {
                                        if (err) return console.log(err);
                                        console.log("Push Success, " + body);
                                    })
                                });

                            }
                        }
                    });
                }
            });
        }
    });
}

function spiderTask() {
    indexAnalysis(function(err) {
        if (err) console.log("[DouBan]Index Analysis Spider Crash, Error Message : " + err);
    });
    bestReviewAnalysis(function(err) {
        if (err) console.log("[DouBan]Best Review Analysis Spider Crash, Error Message : " + err);
    });
}

exports.spiderTask = spiderTask;
exports.pushTask = pushTask;





/*bestReviewAnalysis(function(err, review) {
    console.log(JSON.stringify(review));
});*/
//console.log('Success');
//reviewPageAnalysis({reviewId:25900789}, console.log);

//reviewListAnalysis('25900789', console.log);

//indexAnalysis();

//reviewListAnalysis('24283160');


//pushTask();
//spiderTask();


/*
var server = new Server();
server.sid = '4431';
server.apiSecret = 'ppb3m4asy6ecxbkwyrl61g7z';
server.module = 'douban_book';
server.title = '豆瓣优质书评';
server.cid = '6d062590-9eb2-4292-ab3b-e510c1fc7be7';
server.save(console.log);
*/

//Server.setCID('4431', '6d062590-9eb2-4292-ab3b-e510c1fc7be7', console.log);
