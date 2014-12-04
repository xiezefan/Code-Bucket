var app = angular.module('app', []);

app.controller('timingController', ['$scope', function($scope) {
    $scope.title = '12345';

    $scope.numberArray = function(start, end) {
        var result = [];
        for (var i=start; i<end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.corn = ['*', '*', '*', '*', '*'];
    $scope.cornText = '';

    $scope.selector = {
        week : '*',
        mouth : '*',
        day : '*',
        hour : '*',
        minute : '*'
    };

    $scope.selectorBtnClick = function(type, index) {
        var val = $scope.selector[type];
        if (val == '*') {
            $scope.corn[index] = '*';
        } else {
            if ($scope.corn[index] == '*') {
                $scope.corn[index] = [val];
            } else {
                var inArray = false;
                for (var i=0; i<$scope.corn[index].length; i++) {
                    if ($scope.corn[index][i] == val) {
                        inArray = true;
                    }
                }
                if (!inArray) {
                    $scope.corn[index].push(val);
                }
            }
        }
    }
}]);

app.filter('cornFilter', function() {
    return function(item) {
        var res = '';
        for (var i in item) {
            res = res + item[i] + ' ';
        }
        return res;
    };
});

app.filter('cornTextFilter', function() {
    return function(item) {
        var text = ['星期', '月', '日', '点', '分'];
        var res = ['任意星期', '任意月', '任意日', '任意点', '任意分'];

        /*for (var i in item) {
            var val = item[i];
            if (val == '*') {
                res[i] = '任意' + text[i];
            } else {
                var isFirst = true;
                for (var j in item[i]) {

                    if (isFirst) {
                        res[i] = text[i];
                        res[i] += item[i][j];
                        isFirst = false;
                    } else {
                        res[i] += (', ' + item[i][j]);
                    }
                }
            }
        }*/

        for (var i in item) {
            if (i == 0) {
                if (item[i] == '*') {
                    text[i] = '任意星期';
                } else {
                    text[i] = text[i] + item[i];
                }
            } else {
                text[i] = (item[i] == '*' ? '任意': item[i]) + text[i];
            }

        }

        return text + ' 触发任务';
    };
});