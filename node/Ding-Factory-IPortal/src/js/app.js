var app = angular.module('app', ['ui.router']);

app.run(function($rootScope) {
    $rootScope.menuTitle = '菜单';
    $rootScope.mainTitle = '欢迎页';
});

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');

    $stateProvider.state('index', {
        url : '/index',
        views : {
            '' : {
                templateUrl : 'tpls/home.html'
            },
            'main@index' : {
                templateUrl : 'tpls/main.html'
            }
        }
    }).state('add-simple-service', {
        url : '/simple-service/add',
        views : {
            '' : {
                templateUrl : 'tpls/home.html'
            },
            'main@add-simple-service' : {
                templateUrl : 'tpls/simple-service-add.html'
            }
        }
    }).state('simple-service-list', {
        url : '/simple-service',
        views : {
            '' : {
                templateUrl : 'tpls/home.html'
            },
            'main@simple-service-list' : {
                templateUrl : 'tpls/simple-service-list.html'
            }
        }
    });
});

app.directive('script', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr) {
            if (attr.type === 'text/javascript-lazy') {
                var code = elem.text();
                var f = new Function(code);
                f();
            }
        }
    };
});


app.controller('addSimpleController', ['$state', function($state) {

}]);