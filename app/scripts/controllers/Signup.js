'use strict';

angular.module('lergoApp')
  .controller('SignupCtrl', function ($scope, LergoClient) {
        $scope.signupForm = {
            'username':null,
            'password':null,
            'passwordConfirm':null
        };

        LergoClient.signup( $scope.signupForm).then(
            function(){ console.log()},
            function(){}
        );
  });
