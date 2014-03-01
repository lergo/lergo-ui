'use strict';

angular.module('lergoApp')
    .controller('SignupCtrl', function ($scope, $log, LergoClient) {
        $scope.signupForm = {
            'username': null,
            'password': null,
            'passwordConfirm': null
        };

        LergoClient.signup($scope.signupForm).then(
            function () {
                $log.info('got success');
            },
            function () {
                $log.error('got error');
            }
        );
    });
