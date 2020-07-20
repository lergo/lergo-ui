'use strict';

angular.module('lergoApp').controller('PlaylistsInvitationsReportCtrl',
    function ($scope, $log, LergoClient, $routeParams, LergoTranslate, $location, $filter, $rootScope) {
        $log.info('loading');
        LergoClient.reports.getById($routeParams.reportId).then(function (result) {
            $scope.report = result.data;
            getWrongLesson($scope.report);
            $rootScope.page = {
                'title': $scope.report.data.playlist.name,
                'description': $scope.report.data.playlist.description
            };
            LergoTranslate.setLanguageByName($scope.report.data.playlist.language);
        });
        $scope.stats = [];
        $scope.reportStats = {};
        $scope.$on('stats', function (event, data) {
            $scope.stats[data.index] = data;
            $scope.reportStats.correct = _.sumBy($scope.stats, 'ucq');
            $scope.reportStats.wrong = _.sumBy($scope.stats, 'uwq');
            $scope.reportStats.openLessons = _.sumBy($scope.stats, 'openLessons');
        });

        $scope.absoluteShareLink = function (id) {
            return window.location.origin + '/#!/public/playlists/' + id + '/intro';
        };

        $scope.startPlaylist = function (playlistId) {
            $scope.startBtnDisable=true;
            if (!playlistId) {
                redirectToInvitation($scope.report.data.playlist._id, $scope.report.invitationId);
            } else {
                LergoClient.playlistsInvitations.createAnonymous(playlistId).then(function (result) {
                    redirectToInvitation(playlistId, result.data._id);
                });
            }
        };
        function redirectToInvitation(playlistId, invId) {
            // in case of temporary playlist we don't want to remember history
            if (!$scope.report.data.playlist.temporary) {
                $location.path('/public/playlists/invitations/' + invId + '/display').search({
                    playlistId: playlistId
                });
            } else {
                $location.path('/public/playlists/invitations/' + invId + '/display').search({
                    playlistId: playlistId
                }).replace();
            }
        }

        $scope.showClassReport = function () {

            var report = $scope.report;
            if (angular.isDefined(report) && (angular.isDefined(report.data.invitee))) {
                if (!!report && !! report.data.invitee.class)  {
                    if (!!$rootScope.user && report.data.inviter === $rootScope.user._id) {
                        return true;
                    }
                }
            }
            return false;
        };

        $scope.redirectToClassReport = function () {
            var queryObj = {
                'filter': {invitationId: $scope.report.invitationId},
                'projection': {'_id': 1}
            };
            var promise = LergoClient.userData.getClassReports(queryObj);
            promise.then(function (result) {
                if (!!result.data.data && result.data.data.length > 0) {
                    var reportId = result.data.data[0]._id;
                    $location.path('/public/playlists/reports/agg/' + reportId + '/display');
                }
            }, function (result) {
                $scope.errorMessage = 'Error in fetching reports : ' + result.data.message;
                $log.error($scope.errorMessage);
            });
        };
        $scope.isCompleted = function (report) {
            return LergoClient.reports.isCompleted(report);
        };

        $scope.showPracticeMistake = function () {
            return !!$scope.wrongLessons && $scope.wrongLessons.length > 0 && $scope.isCompleted($scope.report);
        };

        $scope.showContinuePlaylist = function () {
            return !$scope.isCompleted($scope.report);
        };

        $scope.continuePlaylistUrl = function () {
            return LergoClient.reports.continuePlaylistUrl($scope.report);
        };

        $scope.practiceMistakes = function () {
            $scope.practiseBtnDisable = true;
            LergoClient.playlists.createPlaylistFromWrongLessons($scope.report, $scope.wrongLessons).then(
                function (playlist) {
                    $scope.startPlaylist(playlist._id);
                    $scope.practiseBtnDisable = false;
                }, function () {
                    $log.error('Error in creating Practise Playlist');
                    $scope.practiseBtnDisable = false;
                });
        };
        function getWrongLesson(report) {
            $scope.wrongLessons = [];
            angular.forEach(report.answers, function (answer) {
                if (!answer.checkAnswer.correct) {
                    $scope.wrongLessons.push(answer.quizItemId);
                }
            });
        }
    })
;
