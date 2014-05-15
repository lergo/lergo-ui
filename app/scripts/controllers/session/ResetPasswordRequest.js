'use strict';

angular.module('lergoApp')
  .controller('SessionResetPasswordRequestCtrl', function ($scope, $log, $http ) {
    $scope.submitForm = function(){
        $log.info('submitting form');

        $http.post('/backend/')
    }
  });
