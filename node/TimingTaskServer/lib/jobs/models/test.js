var Notify = require('./Notify');

var notify = new Notify({title:'1234'});

notify.save(function(err, notify) {
    console.log(notify);
    notify.notify_url = '4567';
    notify.update(console.log);
});
