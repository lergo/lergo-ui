'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:ClassInviteCtrl
 * @description
 * # ClassInviteCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ClassInviteCtrl', function ($window, $scope, LergoClient, $routeParams, $log, LergoTranslate, $rootScope , $location ) {
        $window.scrollTo(0, 0);

        $scope.classInvite = {};
        var invitation;
        var lessonId = $routeParams.lessonId;

        LergoClient.lessonsInvitations.get($routeParams.invitationId).then(function( result ){
            invitation = result.data;
            $scope.classInvite.className = invitation.invitee.class;
        }).then(function(){
            LergoClient.users.findUsersById([invitation.inviter]).then(function (result) {
                var user = result.data[0];
                $scope.classInvite.username = user.username;
            });
        });

        LergoClient.lessons.getById(lessonId).then(function (result) {
            $scope.classInvite.lessonName = result.data.name;
            $rootScope.lergoLanguage = LergoTranslate.setLanguageByName(result.data.language);
        });




        $scope.createReportFromClassInvite = function () {
            $scope.classInvite.error = null;
            LergoClient.reports.createFromInvitation(invitation, {invitee: {name: $scope.classInvite.studentName}})
                .then(function success(result) {
                    $log.info('invite is ready', result.data);
                    $scope.classInvite.data = result.data;
                    $location.path('/public/lessons/' + lessonId + '/intro').search({
                        lessonId: lessonId,
                        invitationId: invitation._id,
                        reportId: result.data._id
                    });
                }, function error(result) {
                    $scope.classInvite.error = result.data;
                });
        };


    });
