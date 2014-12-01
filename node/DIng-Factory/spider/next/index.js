var request = require('request');
var cheerio = require('cheerio');
var Product = require('../../models/next/Product');
var Util = require('../../common/util');
var Server = require('../../models/server');
var ddHelper = require('../../common/dingdong-helper');

var URL_INDEX = "http://next.36kr.com/posts";
var URL_PAGE = "http://next.36kr.com/posts/";
var HEADER = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36'
};


function indexAnalysis(callback) {
    request.get({
        url : URL_INDEX,
        headers : HEADER
    }, function(err, rsp, data) {
        var $ = cheerio.load(data);

        var date = Util.formatDate('yyyyMMdd');
        $('.post .product-item').slice(0, 5).each(function(i, elem) {
            var title = $(elem).find('.product-url a').text();
            var summary = $(elem).find('.product-url span').text();
            var id = $(elem).find('.product-url a').attr('href');
            var vote = $(elem).find('.upvote span').text().trim();
            if (vote && id) {
                id = id.split('/');
                if (id && id.length > 2) {
                    id = id[id.length - 2];

                    var product = new Product({
                        id:id,
                        title:title,
                        summary:summary,
                        vote:vote,
                        date:date
                    });

                    product.save(function(err, product) {
                        if (err) return callback(err);
                        Product.putQueue(product, callback)
                    });
                }
            }
        });

    });
}

function pushTask(date) {
    if (!date) {
        date = Util.formatDate('yyyyMMdd');
    }
    Product.popQueue(date, function(err, product) {
        console.log(product);
        if (product) {
            Product.inPushSet(product.id, function(err, inPushSet) {
                if (!inPushSet) {
                    Server.all({where:{module:'next_product'}}, function(err, servers) {
                        if (err) return console.log(err);

                        if (servers) {
                            var length = servers.length;
                            while(length--) {
                                var server = servers[length];
                                var options = {
                                    sid:server.sid,
                                    cid:server.cid,
                                    title : product.title + "-" + product.summary,
                                    link : URL_PAGE + product.id
                                };
                                ddHelper.push(options, function(err, body) {
                                    if (err) return console.log(err);
                                    Product.addPushSet(product, function(err) {
                                        if (err) return console.log(err);
                                        console.log("Push Success, " + body);
                                    })
                                });

                            }
                        }
                    });
                } else {
                    pushTask(date);
                }
            });
        }
    });
}

function spiderTask() {
    indexAnalysis(function(err) {
        if (err) {
            console.log('[Next] Index Spider Crash, Error Message : ' + err);
        }
    });
}

exports.pushTask = pushTask;
exports.spiderTask = spiderTask;