'use strict';

angular.module('lergoApp')
    .controller('LessonsInvitesCreateCtrl', function ($scope, $log, LergoClient, $routeParams ) {


        $scope.invite = { 'lessonId' : $routeParams.lessonId, 'invitee' : {} };

        $scope.sendInvite = function () {
            $scope.createError = false;
            $scope.createSuccess = false;
            $log.info('inviting', $scope.invite);
            LergoClient.lessonsInvitations.create($routeParams.lessonId, $scope.invite).then(function(){
                $log.info('after invitation');
                $scope.createSuccess = true;
            }, function(){
                $scope.createError = true;
            });
        }
    }
);
