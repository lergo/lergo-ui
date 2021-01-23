'use strict';

angular.module('lergoApp').controller('PlaylistsInvitationsAggPlaylistRprtCtrl',
    function ($window, $scope, $log, LergoClient, $routeParams, LergoTranslate, $location, $filter, $rootScope) {
        $log.info('loading');
        LergoClient.playlistRprts.getClassPlaylistRprtById($routeParams.playlistRprtId).then(function (result) {
            $scope.playlistRprt = result.data;

            var openQueestions = _.filter($scope.playlistRprt.data.lessonItems, function (item) {
                return item.type === 'openLesson';
            });
            $scope.openLessonCount = openQueestions.length;
            $rootScope.page = {
                'title': $scope.playlistRprt.data.playlist.name,
                'description': $scope.playlistRprt.data.playlist.description
            };
            LergoTranslate.setLanguageByName($scope.playlistRprt.data.playlist.language);
        });

        $scope.getStepAvgDuration = function (index) {
            if (!!$scope.playlistRprt) {
                var stepData = $scope.playlistRprt.stepDurations[index];
                if (!!stepData) {
                    return stepData.duration / stepData.count;
                }
            }
        };

        $scope.getStepCorrectPercentage = function (index) {
            if (!!$scope.playlistRprt) {
                var stepData = $scope.playlistRprt.stepDurations[index];
                if (!!stepData) {
                    return (stepData.correctAnswers * 100)/ stepData.totalAnswers;
                }
            }
        };
        $scope.absoluteShareLink = function (id) {
            return window.location.origin + '/#!/public/playlists/' + id + '/intro';
        };

        $scope.getStepViewByType = function (step) {
            return '/views/playlists/invitations/playlistRprt/steps/_' + step.type + '.html';
        };

        /* $scope.redirectToIndividualPlaylistRprts = function () {
            $location.path('/user/create/playlistRprts').search({
                playlistRprtType: 'students',
                'lergoFilter.playlistRprtClass': $scope.playlistRprt.data.invitee.class,
                'lergoFilter.playlistRprtPlaylist': JSON.stringify({
                    _id: $scope.playlistRprt.data.playlist._id,
                    name: $scope.playlistRprt.data.playlist.name
                })
            });
        };
        $window.scrollTo(0, 0); */
    });
