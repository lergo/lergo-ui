'use strict';

angular.module('lergoApp', ['LocalStorageModule','ngRoute'])
    .config(function ($routeProvider, $httpProvider, $logProvider) {

        $logProvider.debugEnabled(false);

        $routeProvider
            .when('/user/lesson/create',{
                'templateUrl':'views/lesson/create.html',
                'controller':'CreateLessonCtrl'
            })
            .when('/user/lessons', {
                templateUrl: 'views/lessons/index.html',
                controller:'LessonsIndexCtrl'
            })
            .when('/user/questions', {
                templateUrl : 'views/questions/index.html',
                controller: 'QuestionsIndexCtrl'
            })

            .when('/user/questions/:questionId/read', {
                templateUrl : 'views/questions/read.html',
                controller: 'QuestionsReadCtrl'
            })
            .when('/user/lessons/step/display', {
                templateUrl : 'views/lessons/stepDisplay.html',
                controller: 'LessonsStepDisplayPageCtrl'
            })
            .when('/user/lessons/:lessonId/display', {
                templateUrl : 'views/lessons/display.html',
                controller : 'LessonsDisplayCtrl'
            })


            .when('/user/questions/:questionId/update', {
                templateUrl : 'views/questions/update.html',
                controller  : 'QuestionsUpdateCtrl'
            })
            .when('/user/homepage', {
                templateUrl: 'views/homepage.html',
                controller: 'HomepageCtrl'
            })
            .when('/user/lesson/:lessonId/update', {
                templateUrl: 'views/lessons/update.html',
                controller:'LessonsUpdateCtrl'
            })
            .when('/public/kitchenSink', {
                templateUrl: 'views/kitchenSink.html'

            })
            .when('/public/translations/diff', {
                templateUrl: 'views/translations/diff.html',
                controller: 'TranslationsDiffCtrl'
            })
            .when('/public/session/signup', {
                templateUrl: 'views/session/signup.html',
                controller:'SignupCtrl'
            })
            .when('/public/session/login', {
                templateUrl: 'views/session/login.html',
                controller:'LoginCtrl'
            })
            .when('/public/user/validate', {
                templateUrl: 'views/users/validate.html',
                controller:'UsersValidateCtrl'
            })
            .when('/public/user/changePassword', {
                templateUrl : 'views/users/changePassword.html',
                controller: 'UsersChangePasswordCtrl'
            })
            .when('/public/about', {
                templateUrl: 'views/about.html',
                controller: 'SignupCtrl'
            })
            .when('/public/session/resetPasswordRequest', {
                templateUrl : 'views/session/resetPasswordRequest.html',
                controller: 'SessionResetPasswordRequestCtrl'
            })
            .when('/', {
                redirectTo: '/user/lessons'
//                redirectTo: '/public/session/login'
            })
            .otherwise({
                templateUrl: 'views/errors/notFound.html'
//                redirectTo: '/'
            });





        var interceptor = ['$rootScope', '$q', '$location', '$log',function (scope, $q, $location) {

            function success(response) {
                return response;
            }

            function error(response) {
                var status = response.status;

                if ( status === 500 ){

                    if ( typeof(response.data) === 'string' &&  response.data.indexOf('ECONNREFUSED') > 0 ){
                        scope.errorMessage = 'no connection to server';
                        scope.pageError = { 'code' : -1, 'key' : 'no.connection.to.server', 'message' : 'no connection to server'};
                    }else{
                        try{
                            scope.errorMessage = response.data.message;
                            scope.pageError = response.data;
                        }catch(e){
                            scope.errorMessage = 'unknown error';
                            scope.pageError = { 'code' : -2, 'key' : 'unknown.error'  , 'message'  : 'unknown error' };
                        }
                    }

                    scope.clearError = function(){
                        scope.errorMessage = null;
                        scope.pageError = null;
                    };

                }

                if (status === 401 && $location.path().indexOf('/public') !== 0 ) {
                    $location.path( '/public/session/login');
                    return;
                }

                if ( !!response.message ){
                    scope.pageError = response.message;
                }
                // otherwise
                return $q.reject(response);

            }

            return function (promise) {

                return promise.then(success, error);
            };

        }];
        $httpProvider.responseInterceptors.push(interceptor);
        $httpProvider.interceptors.push('RequestProgressInterceptor');



    });
