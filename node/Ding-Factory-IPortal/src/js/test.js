var app = angular.module('myApp', []);

app.run(function($rootScope) {
    $rootScope.name = "Ari Lerner";

    $rootScope.roommaters = [
        {name:'Tom', age:15},
        {name:'Join', age:16},
        {name:'Wiki', age:17},
        {name:'Hello', age:18}
    ];

    $rootScope.info = {
        username : 'xiezefan',
        password : '222222',
        age : 15,
        birth : '1992-09-12'
    }
});

app.controller('myController', function($scope) {
    $scope.person = {
        name : 'xiezefan'
    };

    $scope.clock = new Date();
});

app.controller('myController2', function($scope) {
    $scope.sayHello = function() {
        $scope.person.age = 15;
    };
});

app.controller('counterController', function($scope) {

    $scope.count = 1;

    $scope.add = function(count) {
        $scope.count += count;
    };

    $scope.subtract = function(count) {
        $scope.count -= count;
    }
});

app.controller('getJsonController', function($scope, $http) {
    $scope.getJson = function() {
        $http({
            method : 'GET',
            url : 'http://xiezefan.qiniudn.com/segmentfault_index.json'
        }).success(function(data, status) {
            $scope.data = data;
            $scope.status = status;
        }).error(function(data, status) {
            $scope.data = data;
            $scope.status = status;
        });
    }
});

app.controller('alertController', function($scope) {
    $scope.sayHello = function() {
        alert('Hello, Angular');
    }
});



app.controller('showController', function($scope) {
    $scope.show = false;
    $scope.toggle = function() {
        $scope.show = !$scope.show;
    }
});


app.directive('hello', function() {
    return {
        restrict : 'EA',
        replace : true,
        template : '<h1>Hello World</h1>'
    };
});


app.factory('githubService', ['$http', function($http) {
    var doRequest = function(username) {
        return $http({
            method : 'GET',
            url : 'https://api.github.com/users/' + username + '/events?callback=JSON_CALLBACK'
        });
    };

    return {
        event : function(username) {
            return doRequest(username);
        }
    };
}]);

app.controller('githubController', ['$scope', '$timeout', 'githubService', function($scope, $timeout, githubService) {
    var timeout;
    $scope.$watch('username', function(newUsername) {
        if (newUsername) {
            if (timeout) {
                $timeout.cancel(timeout);
            }

            timeout = $timeout(function() {
                githubService.event(newUsername).success(function(data, status) {
                    $scope.data = data;
                });
            }, 350);
        }

    });
}]);


