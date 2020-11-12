'use strict';

/**
 * @ngdoc function
 * @name lergoApp.controller:PlaylistClassInviteCtrl
 * @description
 * # PlaylistClassInviteCtrl
 * Controller of the lergoApp
 */
angular.module('lergoApp')
    .controller('PlaylistClassInviteCtrl', function ($window, $scope, LergoClient, $routeParams, $log, LergoTranslate, $rootScope , $location, ShareService ) {
        $window.scrollTo(0, 0);

        $scope.playlistClassInvite = {};
        var invitation;
        var playlistId = $routeParams.playlistId;

        LergoClient.playlistsInvitations.get($routeParams.invitationId).then(function( result ){
            invitation = result.data;
            $scope.playlistClassInvite.className = invitation.invitee.class;
        }).then(function(){
            LergoClient.users.findUsersById([invitation.inviter]).then(function (result) {
                var user = result.data[0];
                $scope.playlistClassInvite.username = user.username;
            });
        });

        LergoClient.playlists.getById(playlistId).then(function (result) {
            $scope.playlistClassInvite.playlistName = result.data.name;
            $rootScope.lergoLanguage = LergoTranslate.setLanguageByName(result.data.language);
        });

        $scope.createReportFromPlaylistClassInvite = function () {
            $scope.playlistClassInvite.error = null;
            ShareService.setInvitee($scope.playlistClassInvite.studentName);
            LergoClient.playlistRprts.createFromInvitation(invitation, {invitee: {name: $scope.playlistClassInvite.studentName}})
                .then(function success(result) {
                    $log.info('invite is ready');
                    $scope.playlistClassInvite.data = result.data;
                    $location.path('/public/playlistRprts/' + playlistId + '/intro').search({
                        playlistId: playlistId,
                        invitationId: invitation._id,
                        reportId: result.data._id
                    });
                }, function error(result) {
                    $scope.playlistClassInvite.error = result.data;
                });
        };


    });
