var Config = require('../../config');
var Redis = require('redis');
var Util = require('../../common/Util');

var client = Redis.createClient(Config.redis.port, Config.redis.host);

var keys = {
    main : 'h:timer.timer_task:{id}',
    cron : 's:timer.timer_task.cron:{interval}',
    cron_list : 's:timer.tiemr_task.cron.list'
};


function TimerTask(options) {
    var _options = Util.extend({}, options);
    this.id =_options.id;
    this.cron = _options.cron;
    this.notify_url = _options.notify_url;
    this.title = _options.title;
    this.description = _options.description;
}


function findOne() {

}

function findByCroe() {

}

function crons() {

}

