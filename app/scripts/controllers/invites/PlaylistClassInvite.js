'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:ClassInviteCtrl
 * @description
 * # ClassInviteCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('ClassInviteCtrl', function ($window, $scope, LergoClient, $routeParams, $log, LergoTranslate, $rootScope , $location, ShareService ) {
        $window.scrollTo(0, 0);

        $scope.classInvite = {};
        var invitation;
        var playlistId = $routeParams.playlistId;

        LergoClient.playlistsInvitations.get($routeParams.invitationId).then(function( result ){
            invitation = result.data;
            $scope.classInvite.className = invitation.invitee.class;
        }).then(function(){
            LergoClient.users.findUsersById([invitation.inviter]).then(function (result) {
                var user = result.data[0];
                $scope.classInvite.username = user.username;
            });
        });

        LergoClient.playlists.getById(playlistId).then(function (result) {
            $scope.classInvite.playlistName = result.data.name;
            $rootScope.lergoLanguage = LergoTranslate.setLanguageByName(result.data.language);
        });

        $scope.createReportFromClassInvite = function () {
            $scope.classInvite.error = null;
            ShareService.setInvitee($scope.classInvite.studentName);
            LergoClient.playlistRprts.createFromInvitation(invitation, {invitee: {name: $scope.classInvite.studentName}})
                .then(function success(result) {
                    $log.info('invite is ready');
                    $scope.classInvite.data = result.data;
                    $location.path('/public/playlistRprts/' + playlistId + '/intro').search({
                        playlistId: playlistId,
                        invitationId: invitation._id,
                        reportId: result.data._id
                    });
                }, function error(result) {
                    $scope.classInvite.error = result.data;
                });
        };


    });
