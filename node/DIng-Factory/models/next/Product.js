var Config = require('../../config');
var redis = require('redis');
var client = redis.createClient(Config.redis.port, Config.redis.host);
var Util = require('../../common/util');

var key = {
    list : 's:next.product',
    queue : 'z:next.product:{date}',
    main : 'h:next.product:{id}',
    pushed : 's:next.product.pushed'
};

function Product(options) {
    var _options = Util.extend({}, options);
    this.id =_options.id;
    this.title = _options.title;
    this.summary = _options.summary;
    this.vote = _options.vote;
    this.date = _options.date;
}

Product.prototype.save = function(callback) {
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

Product.findOne = function(id, callback) {
    client.hgetall(key.main.replace('{id}', id), function(err, data) {
        if (err) return callback(err);
        if (data) {
            return callback(null, new Product(data));
        } else {
            return callback(null, null);
        }
    });
};



Product.addPushSet = function(product, callback) {
    if (!callback) callback = _callback;
    client.sadd(key.pushed, product.id, callback);
};

Product.inPushSet = function(id, callback) {
    if (!callback) callback = _callback;
    client.sismember(key.pushed, id, callback);
};

Product.putQueue = function(product, callback) {
    if (!callback) callback = _callback;
    var weight = product.vote;
    client.zadd(key.queue.replace('{date}', product.date), weight, product.id, callback);
};

Product.popQueue = function(date, callback) {
    if (!callback) callback = _callback;
    var queueKey = key.queue.replace('{date}', date);
    client.zcard(queueKey, function(err, count) {
        if (err) return callback(err);

        if (count > 0) {
            client.zrevrange(queueKey, 0, 0, function(err, reviewId) {
                if (err) return callback(err);
                Product.findOne(reviewId, function(err, review) {
                    if (err) return callback(err);
                    if (review) {
                        client.zrem(queueKey, reviewId, function(err) {
                            if (err) return callback(err);
                            callback(null, review);
                        });
                    } else {
                        client.zrem(queueKey, reviewId, function(err) {
                            if (err) return callback(err);
                            Product.popQueue(callback);
                        });
                    }
                });
            });
        } else {
            callback(null, null);
        }
    });
};

Product.getQueueTop = function(callback) {
    if (!callback) callback = _callback;

    var queueKey = key.queue.replace('{date}', product.date);
    client.zcard(queueKey, function(err, count) {
        if (err) return callback(err);

        if (count > 0) {
            client.zrevrange(queueKey, 0, 0, function(err, reviewId) {
                if (err) return callback(err);
                Product.findOne(reviewId, callback);
            });
        } else {
            callback(null, null);
        }
    });
};

function _callback() {}

module.exports = Product;