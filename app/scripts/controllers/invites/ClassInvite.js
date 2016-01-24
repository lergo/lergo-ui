'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:ClassInviteCtrl
 * @description
 * # ClassInviteCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ClassInviteCtrl', function ($scope, LergoClient, $routeParams, $log) {
        $scope.classInvite = {};
        var lessonId = $routeParams.lessonId;
        var by = $routeParams.by;

        LergoClient.lessons.getById(lessonId).then(function (result) {
            $scope.classInvite.lessonName = result.data.name;
        });

        LergoClient.users.findUsersById([by]).then(function (result) {
            var user = result.data[0];
            $scope.classInvite.username = user.username;
        });

        $scope.createInvite = function () {
            $scope.classInvite.error = null;
            if (!!$scope.classInvite.studentName) {
                LergoClient.lessonsInvitations.create(lessonId, {
                    invitee: {name: $scope.classInvite.studentName},
                    by: by,
                    t: $routeParams.t
                })
                    .then(function success(result) {
                        $log.info('invite is ready', result.data);
                        $scope.classInvite.data = result.data;
                        window.location = LergoClient.lessonsInvitations.getLink(result.data);
                    }, function error(result) {
                        $scope.classInvite.error = result.data;
                    });
            }
        };

    });
