(function () {
    'use strict';

    angular.module('lergoApp')
        .controller('UsersChangePasswordCtrl', function ($scope, $http, $routeParams, RequestProgressMonitor) {
            $scope.changePasswordForm = {  'hmac': $routeParams.hmac, 'userId': $routeParams._id  };
            $scope.changePasswordSuccess = false;
            $scope.changePasswordError = false;
            $scope.requestInProgress = true;

            $scope.submitForm = function () {
                $scope.requestProgress = RequestProgressMonitor.newMonitor($http.post('/backend/users/changePassword', $scope.changePasswordForm).then(function () {
                    $scope.changePasswordSuccess = true;
                    $scope.changePasswordError = false;
                    $scope.requestInProgress = false;
                }));
            };
    });
})();
