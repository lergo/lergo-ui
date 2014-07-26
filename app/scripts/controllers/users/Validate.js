'use strict';

angular.module('lergoApp')
  .controller('UsersValidateCtrl', function ($scope, $http, $routeParams, $log, $location ) {
        $scope.validationInProgress = true;
        $http.post('/backend/users/' + $routeParams._id +  '/validate' , { 'hmac' : $routeParams.hmac}).then( function(){
            $scope.validated = true;
            $scope.validationInProgress = false;
        }, function(){
            $scope.validationInProgress = false;
        });
  });
