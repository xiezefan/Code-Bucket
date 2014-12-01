var Config = require('../config');
var redis = require('redis');
var client = redis.createClient(Config.redis.port, Config.redis.host);

var key = {
    main : "h:douban.movie.review:{id}"
};


function DoubanMovieReview(options) {
    this.id = options.id;
    this.title = options.title;
    this.movie = options.movie;
    this.movieId = options.movieId;
    this.useful = options.useful;
    this.star = options.star;
    this.reply = options.reply;
}

DoubanMovieReview.prototype.toString = function() {
    return '12345';
};

DoubanMovieReview.prototype.save = function(callback) {
    var obj = this;
    var saveMap = {};
    for(var p in obj){
        if(typeof(obj[p]) != 'function' && obj[p] != undefined){
            saveMap[p] = obj[p];
        }
    }
    client.hmset(key.main.replace('{id}', this.id), saveMap, function(err) {
        if (err) return callback(err);
        callback(err, this);
    });
};


var review = new DoubanMovieReview({id:'12345', title:'this id titiel'});
review.save(console.log);


