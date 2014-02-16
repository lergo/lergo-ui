'use strict';

angular.module('lergoApp', [])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/lesson/create',{
                'templateUrl':'views/lesson/create.html',
                'controller':'CreateLessonCtrl'
            })
            .when('/homepage', {
                templateUrl: 'views/homepage.html',
                controller: 'HomepageCtrl'
            })
            .when('/kitchenSink', {
                templateUrl: 'views/kitchenSink.html'

            })
            .otherwise({
                redirectTo: '/'
            });
    });
