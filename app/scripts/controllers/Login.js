'use strict';

angular.module('lergoApp')
    .controller('LoginCtrl', function ($scope, $log, LergoClient, $location, $rootScope ) {

        if ( !!$rootScope.user ){
            LergoClient.isLoggedIn().then(function ( result ) {
                $rootScope.user = result.data;
                $location.path('/homepage');
            });
        }

        $scope.login = function () {

            LergoClient.login($scope.form).then(
                function success( result ) {
                    $rootScope.user = result.data;
                    $log.info('logged in!');
                },
                function error(result) {
                    $log.info('error logging in [%s]', result.data);
                }
            );
        }
    });
