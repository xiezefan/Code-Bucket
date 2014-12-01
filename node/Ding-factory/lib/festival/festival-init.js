var Festival =  require('./Festival');
var data = '2014-12-24 平安夜|2014-12-25 圣诞节|2015-2-14 情人节|2015-3-5 元宵节|2015-3-8 妇女节|2015-3-13 黑色星期五|2015-3-15 白色情人节|2015-4-1 愚人节|2015-4-5 清明节/复活节|2015-4-13 泼水节|2015-5-10 母亲节|2015-6-1 儿童节|2015-6-20 端午节|2015-6-21 父亲节|2015-8-20 七夕节|2015-8-28 鬼节|2015-9-10 教师节|2015-11-11 光棍节|2015-11-26 感恩节|2015-12-24 平安夜|2015-12-25 圣诞节';

// 2014.12.1 - 2015.12.31 每个月的长度
var mouthLength = [31,31,28,31,30,31,30,31,31,30,31,30,31];

// 计算给定日期距离 2014-12-1 号多少天, 注:2014-12-1 距离 2014-12-1 为 1天
function buildOffset(date) {
    var dateArr = date.split('-');

    if (dateArr[0] == '2014') {
        return parseInt(dateArr[2]);
    }

    var offset = mouthLength[0];
    for (var i=1; i<parseInt(dateArr[1]); i++) {
        offset += mouthLength[i];
    }

    offset += parseInt(dateArr[2]);
    return offset;
}

// process
data = data.split('|');

var festivals = [];
for (var i=0; i<data.length; i++) {
    var festivalArr = data[i].split(' ');
    var festival = {
        name : festivalArr[1],
        date : festivalArr[0],
        offset : buildOffset(festivalArr[0])
    };
    festivals.push(festival);

    // save to mongodb
    /*
    new Festival({
        name : festivalArr[1],
        date : festivalArr[0],
        offset : buildOffset(festivalArr[0])
    }).save(console.log);
    */
}





//console.log(JSON.stringify(festivals));
//result = [{"name":"平安夜","date":"2014-12-24","offset":24},{"name":"圣诞节","date":"2014-12-25","offset":25},{"name":"情人节","date":"2015-2-14","offset":76},{"name":"元宵节","date":"2015-3-5","offset":95},{"name":"妇女节","date":"2015-3-8","offset":98},{"name":"黑色星期五","date":"2015-3-13","offset":103},{"name":"白色情人节","date":"2015-3-15","offset":105},{"name":"愚人节","date":"2015-4-1","offset":122},{"name":"清明节/复活节","date":"2015-4-5","offset":126},{"name":"泼水节","date":"2015-4-13","offset":134},{"name":"母亲节","date":"2015-5-10","offset":161},{"name":"儿童节","date":"2015-6-1","offset":183},{"name":"端午节","date":"2015-6-20","offset":202},{"name":"父亲节","date":"2015-6-21","offset":203},{"name":"七夕节","date":"2015-8-20","offset":263},{"name":"鬼节","date":"2015-8-28","offset":271},{"name":"教师节","date":"2015-9-10","offset":284},{"name":"光棍节","date":"2015-11-11","offset":346},{"name":"感恩节","date":"2015-11-26","offset":361},{"name":"平安夜","date":"2015-12-24","offset":389},{"name":"圣诞节","date":"2015-12-25","offset":390}]


/*var now = new Date();
now = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
console.log(now)*/


Festival.find({offset:36}, function(err, festivals) {
    var festival = festivals[0];
    festival.offset = 6;
    festival.save(console.log);
});