var Config = require('../../config');
var redis = require('redis');
var client = redis.createClient(Config.redis.port, Config.redis.host);
var Util = require('../../common/util');

var key = {
    list : 's:douban.book.review',
    main : 'h:douban.book.review:{id}',
    queue : 'z:douban.book.review.weight',
    pushed : 's:douban.book.review.pushed'
};

function BookReview(options) {
    var _options = Util.extend({}, options);
    this.id = _options.id;
    this.title = _options.title;
    this.book = _options.book;
    this.bookId = _options.bookId;
    this.useful = _options.useful;
    this.star = _options.star;
    this.reply = _options.reply;
}

function _callback() {}

BookReview.prototype.save = function(callback) {
    if (!callback) callback = _callback;
    var obj = this;
    var saveMap = {};
    for(var p in obj){
        if(typeof(obj[p]) != 'function' && obj[p] != undefined){
            saveMap[p] = obj[p];
        }
    }
    client.hmset(key.main.replace('{id}', this.id), saveMap, function(err) {
        if (err) return callback(err);
        client.sadd(key.list, saveMap.id, function(err) {
            if (err) return callback(err);
            callback(null, obj);
        });
    });
};

BookReview.putQueue = function(review, callback) {
    if (!callback) callback = _callback;
    var weight = review.useful;
    client.zadd(key.queue, weight, review.id, callback);
};

BookReview.popQueue = function(callback) {
    if (!callback) callback = _callback;

    client.zcard(key.queue, function(err, count) {
        if (err) return callback(err);

        if (count > 0) {
            client.zrevrange(key.queue, 0, 0, function(err, reviewId) {
                if (err) return callback(err);
                BookReview.findOne(reviewId, function(err, review) {
                    if (err) return callback(err);
                    if (review) {
                        client.zrem(key.queue, reviewId, function(err) {
                            if (err) return callback(err);
                            callback(null, review);
                        });
                    } else {
                        client.zrem(key.queue, reviewId, function(err) {
                            if (err) return callback(err);
                            BookReview.popQueue(callback);
                        });
                    }
                });
            });
        } else {
            callback(null, null);
        }
    });
};

BookReview.getQueueTop = function(callback) {
    if (!callback) callback = _callback;

    client.zcard(key.queue, function(err, count) {
        if (err) return callback(err);

        if (count > 0) {
            client.zrevrange(key.queue, 0, 0, function(err, reviewId) {
                if (err) return callback(err);
                BookReview.findOne(reviewId, callback);
            });
        } else {
            callback(null, null);
        }
    });
};

BookReview.addPushSet = function(review, callback) {
    if (!callback) callback = _callback;
    client.sadd(key.pushed, review.id, callback);
};

BookReview.inPushSet = function(id, callback) {
    if (!callback) callback = _callback;
    client.sismember(key.pushed, id, callback);
};


BookReview.findOne = function(id, callback) {
    client.hgetall(key.main.replace('{id}', id), function(err, data) {
        if (err) return callback(err);
        if (data) {
            return callback(null, new BookReview(data));
        } else {
            return callback(null, null);
        }
    });
};

module.exports = BookReview;

