var request = require('request');
var cheerio = require('cheerio');

var item = {
    id : '987654312',
    title : 'layer阴影动画问题',
    user : {
        id : '12345',
        nickname : 'xiezefan'
    },
    action : {
        date : new Date().getTime(),
        type : 'reply'
    },
    best_reply : {
        praise : 50,
        content : '如果是服务器应用的话，建议装LTS。 另外搜了一下，似乎是14.10的Bug，14.10开始用systemd了。'
    }
};


request.get({
    url : 'http://segmentfault.com/'
}, function(err, rsp, data) {
    var $ = cheerio.load(data);
    var result = [];
    $('.stream-list__item').each(function(i, elem) {
        var _$ = $(elem);
        var item = {};
        item['id'] = _$.find('.title a').attr('href').split('/')[2].trim()
        item['title'] = _$.find('.title').text().trim();
        var user = {};
        user['id'] = _$.find('.author a').first().attr('href').split('/')[2].trim();
        user['name'] = _$.find('.author a').first().text().trim();
        item['user'] = user;
        item['action'] = _$.find('.author a').last().text().trim();

        var tags = [];
        _$.find('.tagPopup').each(function(i, elem) {
            tags.push($(elem).text().trim());
        });

        var rank = {};
        rank['votes'] = _$.find('.votes').text().replace('投票', '').trim();
        rank['answers'] = _$.find('.answers').text().replace('解决', '').replace('回答', '').trim();
        rank['views'] = _$.find('.views').text().replace('浏览', '').trim();
        item['rank'] = rank;

        item['tags'] = tags;
        result.push(item);

    });
    console.log(JSON.stringify(result));
});


