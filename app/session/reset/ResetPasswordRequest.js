(function () {
    'use strict';

    angular.module('lergoApp')
        .controller('SessionResetPasswordRequestCtrl', function ($scope, $log, $http) {
            $scope.resetForm = {};


            $scope.submitForm = function () {
                $log.info('submitting form');


                $scope.requestSuccess = false;
                $scope.requestError = false;
                $scope.requestInProgress = true;
                $http.post('/backend/users/requestPasswordReset', $scope.resetForm).then(function (result) {
                    $log.info('got response', result.data);
                    $scope.requestInProgress = false;
                    $scope.requestSuccess = true;
                }, function (result) {
                    $scope.requestError = true;
                    $scope.requestInProgress = false;
                    $log.error('got error', result.data);
                });
            };
    });
})();

