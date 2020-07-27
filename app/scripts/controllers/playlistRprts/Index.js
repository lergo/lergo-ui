'use strict';

angular.module('lergoApp').controller('PlaylistRprtsIndexCtrl',
    function ($scope, LergoClient, TagsService, $routeParams, $log, LergoTranslate, $location, $rootScope,
              localStorageService, $window, $filter) {

        $scope.playlistRprtsFilter = {};
        $scope.filterPage = {};
        $scope.playlistRprtsFilterOpts = {
            'showSubject': true,
            'showLanguage': true,
            'showPlaylistRprtStatus': true,
            'showStudents': true,
            'showClass': true,
            'showCorrectPercentage': true,
            'showPlaylistRprtPlaylist': true
        };

        $scope.getPlaylistRprtName = function (playlistRprt) {
            return ( playlistRprt && playlistRprt.data && playlistRprt.data.playlist && playlistRprt.data.playlist.name && playlistRprt.data.playlist.name.trim().length > 0) ? playlistRprt.data.playlist.name : '[no name]';
        };

        $scope.playlistRprtTypes = [{
            'id': 'mine'
        }, {
            'id': 'students'
        }, {
            'id': 'class'
        }];

        $scope.playlistRprtsPage = {
            playlistRprtType: 'students',
            selectAll: false
        };

        function isMyPlaylistRprts() {
            return $scope.playlistRprtsPage.playlistRprtType === 'mine';
        }

        $scope.$watch('playlistRprtsPage.playlistRprtType', function (newValue/* , oldValue */) {
            $log.info('playlistRprtType changed');
            $scope.playlistRprtsFilterOpts.showStudents = isStudentsPlaylistRprts();
            $scope.playlistRprtsFilterOpts.showClass = isStudentsPlaylistRprts() || isClassPlaylistRprts();
            $scope.playlistRprtsFilterOpts.showPlaylistRprtStatus = isStudentsPlaylistRprts() || isMyPlaylistRprts();
            $scope.filterPage.current = 1;
            $scope.filterPage.updatedLast = new Date().getTime(); // create a
            // 'change'
            // event
            // artificially..
            localStorageService.set('playlistRprtType', newValue);
            $location.search('playlistRprtType', newValue);

        });

        var playlistRprtType = $routeParams.playlistRprtType || localStorageService.get('playlistRprtType');
        if (!!playlistRprtType) {
            $scope.playlistRprtsPage.playlistRprtType = playlistRprtType;
        }

        function isStudentsPlaylistRprts() {
            return $scope.playlistRprtsPage.playlistRprtType === 'students';
        }

        function isClassPlaylistRprts() {
            return $scope.playlistRprtsPage.playlistRprtType === 'class';
        }

        $scope.showStudentColumn = function () {
            return isStudentsPlaylistRprts();
        };

        $scope.showStudentCountColumn = function () {
            return isClassPlaylistRprts();
        };

        $scope.showClassColumn = function () {
            return isClassPlaylistRprts() || isStudentsPlaylistRprts();
        };

        $scope.getPlaylistRprtLink = function (playlistRprtId) {
            if (isClassPlaylistRprts()) {
                return '#!/public/playlists/playlistRprts/agg/' + playlistRprtId + '/display';
            }
            return '#!/public/playlists/playlistRprts/' + playlistRprtId + '/display';
        };


        $scope.isCompleted = function (playlistRprt) {
            if (isClassPlaylistRprts()) {
                return true;
            }
            return LergoClient.playlistRprts.isCompleted(playlistRprt);

        };

        $scope.loadPlaylistRprts = function () {

            $scope.playlistRprtsPage.selectAll = false;

            $log.info('loading playlistRprts');

            if (!$scope.filterPage.current) {
                return;
            }

            var queryObj = {
                'filter': _.merge({}, $scope.playlistRprtsFilter),
                'projection': {'data.quizItems': 0},
                'sort': {
                    'lastUpdate': -1
                },
                'dollar_page': $scope.filterPage
            };
            var promise = null;
            if (isMyPlaylistRprts()) {
                promise = LergoClient.userData.getPlaylistRprts(queryObj);
            } else if (isStudentsPlaylistRprts()) {
                promise = LergoClient.userData.getStudentsPlaylistRprts(queryObj);
            } else if (isClassPlaylistRprts()) {
                promise = LergoClient.userData.getClassPlaylistRprts(queryObj);
            }

            promise.then(function (result) {
                $scope.playlistRprts = result.data.data;
                $scope.filterPage.count = result.data.count;
                $scope.errorMessage = null;
            }, function (result) {
                $scope.errorMessage = 'Error in fetching playlistRprts : ' + result.data.message;
                $log.error($scope.errorMessage);
            });
            scrollToPersistPosition();
        };
        $scope.createPlaylistFromWrongLessons = function () {
            LergoClient.playlists.create().then(function (result) {
                var playlist = result.data;
                playlist.name = $filter('translate')('playlist.practice.title');
                // todo: is this wrong?? shouldn't we take it from the playlist?
                playlist.language = LergoTranslate.getLanguageObject().name;
                playlist.steps = [];
                playlist.description = '';
                playlist.lastUpdate = new Date().getTime();
                var step = {
                    'type': 'quiz',
                    'quizItems': [],
                    'retBefCrctAns': 1,
                    'title': $filter('translate')('playlist.practice.step.title')
                };
                playlist.steps.push(step);
                angular.forEach($scope.playlistRprts, function (playlistRprt) {
                    if (playlistRprt.selected === true) {
                        playlist.name = playlist.name + playlistRprt.data.playlist.name + ',';
                        playlist.description = playlist.description + playlistRprt.data.playlist.name + '\n';
                        getWrongLessons(playlistRprt.answers, playlist);
                    }
                });
                playlist.name = playlist.name.slice(0, -1);
                LergoClient.playlists.update(playlist).then(function () {
                    $location.path('/user/playlists/' + playlist._id + '/intro');
                });
            });

        };

        $scope.selectAll = function (event) {
            var checkbox = event.target;
            angular.forEach($scope.playlistRprts, function (item) {
                item.selected = checkbox.checked;
            });
        };

        function getWrongLessons(answers, playlist) {
            angular.forEach(answers, function (answer) {
                if (!answer.checkAnswer.correct) {
                    if (playlist.steps[0].quizItems.indexOf(answer.quizItemId) === -1) {
                        playlist.steps[0].quizItems.push(answer.quizItemId);
                    }
                }
            });
        }

        $scope.deletePlaylistRprts = function () {
            var toDelete = 0;
            if (confirm($filter('translate')('deletePlaylistRprts.Confirm'))) {
                angular.forEach($scope.playlistRprts, function (playlistRprt) {
                    if (playlistRprt.selected === true) {
                        if (isClassPlaylistRprts()) {
                            playlistRprt.isClassPlaylistRprt = true;
                        }
                        toDelete++;
                        LergoClient.playlistRprts.deletePlaylistRprt(playlistRprt).then(function () {
                            toDelete--;
                            $scope.errorMessage = null;
                            $scope.playlistRprts.splice($scope.playlistRprts.indexOf(playlistRprt), 1);
                            $log.info('playlistRprt deleted successfully');
                            if (toDelete === 0) {
                                $scope.loadPlaylistRprts();
                            }
                        }, function (result) {
                            $scope.errorMessage = 'Error in deleting playlistRprt : ' + result.data.message;
                            $log.error($scope.errorMessage);
                        });
                    }
                });
            }
        };

        var path = $location.path();
        $scope.$on('$locationChangeStart', function () {
            persistScroll($scope.filterPage.current);
        });

        $scope.$watch('filterPage.current', function (newValue, oldValue) {
            if (!!oldValue) {

                persistScroll(oldValue);
            }
        });
        function persistScroll(pageNumber) {
            if (!$rootScope.scrollPosition) {
                $rootScope.scrollPosition = {};
            }
            $rootScope.scrollPosition[path + ':page:' + pageNumber] = $window.scrollY;
        }

        function scrollToPersistPosition() {
            var scrollY = 0;
            if (!!$rootScope.scrollPosition) {
                scrollY = $rootScope.scrollPosition[path + ':page:' + $scope.filterPage.current] || 0;
            }
            $window.scrollTo(0, scrollY);
        }

    });
