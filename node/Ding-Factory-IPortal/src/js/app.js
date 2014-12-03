var app = angular.module('myApp', []);

app.run(function($rootScope) {
    $rootScope.name = "Ari Lerner";
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