'use strict';

angular.module('lergoApp', [])
    .config(function ($routeProvider, $httpProvider) {

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
            .when('/session/signup', {
                templateUrl: 'views/session/signup.html',
                controller:'SignupCtrl'
            })
            .when('/session/login', {
                templateUrl: 'views/session/login.html',
                controller:'LoginCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html'
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
                if (status == 401 && $location.path() != "/session/login") {
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
