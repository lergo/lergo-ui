'use strict';

angular.module('lergoApp', [])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/homepage', {
                templateUrl: 'views/homepage.html',
                controller: 'HomepageCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
