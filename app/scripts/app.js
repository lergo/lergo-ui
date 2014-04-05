'use strict';

angular.module('lergoApp', [])
    .config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/user/lesson/create',{
                'templateUrl':'views/lesson/create.html',
                'controller':'CreateLessonCtrl'
            })
            .when('/user/homepage', {
                templateUrl: 'views/homepage.html',
                controller: 'HomepageCtrl'
            })
            .when('/public/kitchenSink', {
                templateUrl: 'views/kitchenSink.html'

            })
            .when('/public/session/signup', {
                templateUrl: 'views/session/signup.html',
                controller:'SignupCtrl'
            })
            .when('/public/session/login', {
                templateUrl: 'views/session/login.html',
                controller:'LoginCtrl'
            })
            .when('/public/about', {
                templateUrl: 'views/about.html',
                controller: 'SignupCtrl'
            })
            .otherwise({
                templateUrl: 'views/errors/notFound.html'
//                redirectTo: '/'
            });





        var interceptor = ['$rootScope', '$q', '$location', function (scope, $q, $location) {

            function success(response) {
                return response;
            }

            function error(response) {
                var status = response.status;
                if (status == 401 && $location.path().startsWith("/public") ) {
                    $location.path( "/session/login");
                    return;
                }

                if ( !!response.message ){
                    scope.pageError = message;
                }
                // otherwise
                return $q.reject(response);

            }

            return function (promise) {
                return promise.then(success, error);
            }

        }];
        $httpProvider.responseInterceptors.push(interceptor);



    });
