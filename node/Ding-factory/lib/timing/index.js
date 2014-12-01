var later = require('later');
var domain = require('domain');

// 设置当地时间
later.date.localTime();

var d = domain.create();
d.on('error', function(err) {
    console.error('Error caught by domain:', err);
});

function setInterval(schedule, task) {
    d.run(function() {

    });
}

function setTiming() {

}

