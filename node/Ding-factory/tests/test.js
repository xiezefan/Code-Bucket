/*
var redis = require('redis');

var client = redis.createClient(6379, '127.0.0.1');

client.keys('mission:*', function(err, missions) {
   var length = missions.length;
   while(length--) {
       client.hset(missions[length], 'lastChapter', '');
       console.log('Update Success. ' + missions[length]);
   }

});*/


console.log(new Date().toString());