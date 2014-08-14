'use strict';

angular.module('lergoApp')
    .service('DisqusService', function DisqusService($q, $rootScope, $log, $http, LergoClient) {

        var loginDefer = $q.defer();



        this.login = function () {
            return loginDefer.promise;
        };


        LergoClient.isLoggedIn().then(function (result) {
            if (!!result) {

                $rootScope.user = result.data;
            }
        });

        function getDisqusDetails(user) {
            $log.info('user changed on rootScope', $rootScope.user);
            if (!!user) {
                $http.get('/backend/user/disqusLogin').then(function (result) {
                    loginDefer.resolve(result.data);
                });
            }
        }

        $rootScope.$watch('user', getDisqusDetails);


    });
