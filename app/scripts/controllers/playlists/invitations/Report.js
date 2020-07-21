'use strict';

angular.module('lergoApp').controller('PlaylistsInvitationsPlaylistRprtCtrl',
    function ($scope, $log, LergoClient, $routeParams, LergoTranslate, $location, $filter, $rootScope) {
        $log.info('loading');
        LergoClient.playlistRprts.getById($routeParams.playlistRprtId).then(function (result) {
            $scope.playlistRprt = result.data;
            getWrongLesson($scope.playlistRprt);
            $rootScope.page = {
                'title': $scope.playlistRprt.data.playlist.name,
                'description': $scope.playlistRprt.data.playlist.description
            };
            LergoTranslate.setLanguageByName($scope.playlistRprt.data.playlist.language);
        });
        $scope.stats = [];
        $scope.playlistRprtStats = {};
        $scope.$on('stats', function (event, data) {
            $scope.stats[data.index] = data;
            $scope.playlistRprtStats.correct = _.sumBy($scope.stats, 'ucq');
            $scope.playlistRprtStats.wrong = _.sumBy($scope.stats, 'uwq');
            $scope.playlistRprtStats.openLessons = _.sumBy($scope.stats, 'openLessons');
        });

        $scope.absoluteShareLink = function (id) {
            return window.location.origin + '/#!/public/playlists/' + id + '/intro';
        };

        $scope.startPlaylist = function (playlistId) {
            $scope.startBtnDisable=true;
            if (!playlistId) {
                redirectToInvitation($scope.playlistRprt.data.playlist._id, $scope.playlistRprt.invitationId);
            } else {
                LergoClient.playlistsInvitations.createAnonymous(playlistId).then(function (result) {
                    redirectToInvitation(playlistId, result.data._id);
                });
            }
        };
        function redirectToInvitation(playlistId, invId) {
            // in case of temporary playlist we don't want to remember history
            if (!$scope.playlistRprt.data.playlist.temporary) {
                $location.path('/public/playlists/invitations/' + invId + '/display').search({
                    playlistId: playlistId
                });
            } else {
                $location.path('/public/playlists/invitations/' + invId + '/display').search({
                    playlistId: playlistId
                }).replace();
            }
        }

        $scope.showClassPlaylistRprt = function () {

            var playlistRprt = $scope.playlistRprt;
            if (angular.isDefined(playlistRprt) && (angular.isDefined(playlistRprt.data.invitee))) {
                if (!!playlistRprt && !! playlistRprt.data.invitee.class)  {
                    if (!!$rootScope.user && playlistRprt.data.inviter === $rootScope.user._id) {
                        return true;
                    }
                }
            }
            return false;
        };

        $scope.redirectToClassPlaylistRprt = function () {
            var queryObj = {
                'filter': {invitationId: $scope.playlistRprt.invitationId},
                'projection': {'_id': 1}
            };
            var promise = LergoClient.userData.getClassPlaylistRprts(queryObj);
            promise.then(function (result) {
                if (!!result.data.data && result.data.data.length > 0) {
                    var playlistRprtId = result.data.data[0]._id;
                    $location.path('/public/playlists/playlistRprts/agg/' + playlistRprtId + '/display');
                }
            }, function (result) {
                $scope.errorMessage = 'Error in fetching playlistRprts : ' + result.data.message;
                $log.error($scope.errorMessage);
            });
        };
        $scope.isCompleted = function (playlistRprt) {
            return LergoClient.playlistRprts.isCompleted(playlistRprt);
        };

        $scope.showPracticeMistake = function () {
            return !!$scope.wrongLessons && $scope.wrongLessons.length > 0 && $scope.isCompleted($scope.playlistRprt);
        };

        $scope.showContinuePlaylist = function () {
            return !$scope.isCompleted($scope.playlistRprt);
        };

        $scope.continuePlaylistUrl = function () {
            return LergoClient.playlistRprts.continuePlaylistUrl($scope.playlistRprt);
        };

        $scope.practiceMistakes = function () {
            $scope.practiseBtnDisable = true;
            LergoClient.playlists.createPlaylistFromWrongLessons($scope.playlistRprt, $scope.wrongLessons).then(
                function (playlist) {
                    $scope.startPlaylist(playlist._id);
                    $scope.practiseBtnDisable = false;
                }, function () {
                    $log.error('Error in creating Practise Playlist');
                    $scope.practiseBtnDisable = false;
                });
        };
        function getWrongLesson(playlistRprt) {
            $scope.wrongLessons = [];
            angular.forEach(playlistRprt.answers, function (answer) {
                if (!answer.checkAnswer.correct) {
                    $scope.wrongLessons.push(answer.quizItemId);
                }
            });
        }
    })
;
