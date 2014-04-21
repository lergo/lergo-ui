'use strict';

angular.module('lergoApp')
    .controller('SignupCtrl', function ($scope, $log, LergoClient, $location ) {
        $scope.signupForm = {
            'username': null,
            'email':null,
            'password': null,
            'passwordConfirm': null
        };

        $scope.submit = function () {
            LergoClient.signup($scope.signupForm).then(
                function () {
                    $log.info('got success');
                    $location.path('/public/session/login');
                },
                function () {
                    $log.error('got error');
                }
            );
        };


        setInterval(function(){$('#issues').scrollLeft(200).scrollTop( Math.max($("#issues").scrollTop(), 160));}, 1000);
    }


);
