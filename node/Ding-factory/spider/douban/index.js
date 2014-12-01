var request = require('request');
var cheerio = require('cheerio');
var Review = require('../../models/doubanMovieReview');
var ddHelper = require('../../common/dingdong-helper');
var Server = require('../../models/server');

var URL_REVIEW_PAGE = 'http://movie.douban.com/review/{review_id}/';
var URL_REVIEW_LIST = 'http://movie.douban.com/subject/{movie_id}/reviews';
var URL_MOVIE_INDEX = "http://movie.douban.com/";
var URL_SEARCH_SUBJECTS = "http://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=50&page_start=0";


function reviewPageSpider(review, callback) {
    request.get({
        url : URL_REVIEW_PAGE.replace("{review_id}", review.id)
    }, function(err, rsp, data) {
        if (err) {
            callback(err);
        } else {
            var $ = cheerio.load(data);
            var title = $('span[property="v:summary"]').text();
            var count = $('#ucount' + review.id + 'u').text();
            var movie = $('.side-back a').text();
            var movieId = $('.side-back a').attr('href').split('/');
            movieId = movieId[movieId.length - 2];
            console.log("ID:" + review.id);
            console.log("Title:" + title);
            console.log("Praise:" + count);
            console.log("Movie:" + movie);
            console.log("MovieId:" + movieId);
            console.log('--------------------------');
        }
    });
}

function reviewListSpider(movie, callback) {


    request.get({
        url : URL_REVIEW_LIST.replace("{movie_id}", movie.id)
    }, function(err, rsp, data) {
        if (err) {
            callback(err);
        } else {
            var $ = cheerio.load(data);
            $('.review').each(function(i, elem) {
                try {
                    var _$ = $(elem);
                    var title = _$.find(".review-hd h3").text().trim();
                    var id = _$.find(".review-hd h3 div").attr('id').split('-')[1];
                    var useful = _$.find("#" + id + "_short_useful").text().split('/')[0];
                    var star = _$.find(".review-hd-info span").attr('class').replace("allstar", "");
                    var reply = _$.find(".review-short-ft a").text().replace("回复", "").trim();

                    Review.inPushSet(id, function(err, inPushSet) {
                        if (err) return callback(err);
                        if (inPushSet) {
                            console.log('Review id is in pushed set, ignore.');
                        } else {
                            Review.findOne({where:{reviewId:id}}, function(err, review) {
                                if (err) return callback(err);
                                if (review) {
                                    console.log('Review is exist, update it.');
                                    review.updateAttribute('useful', useful, function(err) {
                                        if (err) return callback(err);
                                        review.updateAttribute('star', star, function(err) {
                                            if (err) return callback(err);
                                            review.updateAttribute('reply', reply, function(err) {
                                                if (err) return callback(err);
                                                review.useful = useful;
                                                review.star = star;
                                                review.reply = reply;
                                                callback(null, review);
                                            });
                                        });
                                    });
                                } else {
                                    review = new Review();
                                    review.reviewId = id;
                                    review.star = star;
                                    review.reply =  reply;
                                    review.movie = movie.title;
                                    review.movieId = movie.id;
                                    review.title = title;
                                    review.useful = useful;

                                    review.save(function(err, review) {
                                        review.putQueue(function(err) {
                                            if (err) return callback(err);
                                            callback(null, review);
                                        });
                                    });

                                }

                            });
                        }

                    });





                } catch (e) {
                    console.log(e);
                }
            });


        }
    });

}

function movieIndexSpider(callback) {
    request.get({
        url : URL_MOVIE_INDEX
    }, function(err, rsp, data) {
        if (err) {
            callback(err);
        } else {
            var $ = cheerio.load(data);
            $('.ui-slide-item').each(function(i, elem) {
                var title = $(elem).attr('data-title');
                if (title) {
                    title = title.trim().split(' ')[0];
                }
                var id = $(elem).attr('data-trailer');
                if (id) {
                    id = id.split('/');
                    id = id[id.length-2];
                }

                if (title && id) {
                    reviewListSpider({title:title, id:id}, console.log);
                }
            });

            $('.item').each(function(i, elem) {
                var id = $(elem).find('div').attr('data-id');
                var title = $(elem).find('img').attr('alt');
                if (id && title) {
                    reviewListSpider({title:title, id:id}, console.log);
                }
            });


        }
    });
}

function movieSearchSub(){
    request.get({
        url : URL_SEARCH_SUBJECTS
    }, function(err, rsp, data) {
        console.log(data);
        var resData = JSON.parse(data);
        var subjects = resData.subjects;
        var length = subjects.length;
        while(length--) {
            var movie = subjects[length];
            reviewListSpider(movie, console.log);
        }
    });
}


function doubanSpiderTask() {
    movieIndexSpider();
    movieSearchSub();
}

function doubanPushTask() {
    Review.popQueueTop(function(err, review) {
        if (err) return console.log(err);
        if (!review) return;
        Review.inPushSet(review.reviewId, function(err, inPushSet) {
            if (err) return console.log('[doubanPushTask] DB Fail');
            if (inPushSet) {
                console.log("review.reviewId is push, run again...");
                doubanPushTask();
            } else {
                Server.all({where:{module:'douban_movie'}}, function(err, servers) {
                    if (err) return console.log(err);
                    if (servers) {
                        var length = servers.length;
                        while(length--) {
                            var server = servers[length];
                            ddHelper.push({sid:server.sid, cid:server.cid, title: "《" + review.movie + "》" + review.title, link:URL_REVIEW_PAGE.replace("{review_id}", review.reviewId)}, function(err, body) {
                                if (err) return console.log(err);
                                Review.addPushSet(review.reviewId, function(err) {
                                    if (err) return console.log(err);
                                    console.log("Push Success, " + body);
                                })
                            });
                        }
                    }
                });
            }
        });
    });
}

//reviewPageSpider('6782822');
//reviewPageSpider('7106284');

//reviewListSpider('25717233');
//reviewListSpider('7065154');


//setInterval(doubanPushTask, 1000);

exports.spiderTask = function() {
    movieIndexSpider();
    movieSearchSub();
};
exports.pushTask = doubanPushTask;