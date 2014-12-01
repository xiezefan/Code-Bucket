var Schema = require('jugglingdb').Schema;
var Config = require('../config');
var redis = require('redis');

var schema = new Schema('redis', {port: Config.redis.port, host: Config.redis.host});
var client = redis.createClient(Config.redis.port, Config.redis.host);
var KEY_REVIEW_PUSH_SET = "s:review.was.pushed";
var KEY_REVIEW_WEIGHT_QUEUE = "z:review.weight.queue";

var Review = schema.define('douban_movie_review', {
    reviewId : {type:String, index:true},
    title : String,
    movieId : {type:String, index:true},
    movie : String,
    useful : Number,
    star : Number,
    reply : Number
});

Review.validatesUniquenessOf('reviewId', {message: 'reviewId is not unique'});

Review.prototype.putQueue = function(callback) {
    client.zadd(KEY_REVIEW_WEIGHT_QUEUE, this.useful, this.reviewId, callback);
};

/* static */
Review.addPushSet = function(reviewId, callback) {
    client.sadd(KEY_REVIEW_PUSH_SET, reviewId, callback);
};

Review.inPushSet = function(reviewId, callback) {
    client.sismember(KEY_REVIEW_PUSH_SET, reviewId, callback);
};
Review.getQueueTop = function(callback) {
    client.zrevrange(KEY_REVIEW_WEIGHT_QUEUE, 0, 0, function(err, reviewId) {
        if (err) return callback(err);
        Review.findOne({where:{reviewId:reviewId}}, callback);
    });
};

Review.popQueueTop = function(callback) {
    client.zrevrange(KEY_REVIEW_WEIGHT_QUEUE, 0, 0, function(err, reviewId) {
        if (err) return callback(err);
        Review.findOne({where:{reviewId:reviewId}}, function(err, review) {
            if (err) return callback(err);
            if (review) {
                client.zrem(KEY_REVIEW_WEIGHT_QUEUE, reviewId, function(err) {
                    if (err) return callback(err);
                    callback(null, review);
                });
            } else {
                client.zrem(KEY_REVIEW_WEIGHT_QUEUE, reviewId, function(err) {
                    if (err) return callback(err);
                    Review.popQueueTop(callback);
                });
            }

        });
    });
};



module.exports = Review;
