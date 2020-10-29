'use strict';

angular.module('lergoApp')
    .controller('UsersChangePasswordCtrl', function ($scope, $http, $routeParams, RequestProgressMonitor) {

        // jeff: when user clicks on link to change password, the previous password will be validated
        // this prevents the unpleasant situation that users forget the unvalidated password, and it 'loops'
        $scope.validationInProgress = true;
        $http.post('/backend/users/' + $routeParams._id + '/validate', { 'hmac': $routeParams.hmac}).then(function () {
            $scope.validated = true;
            $scope.validationInProgress = false;
        }, function () {
            $scope.validationInProgress = false;
        });

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
