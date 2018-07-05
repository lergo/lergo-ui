'use strict';

angular.module('lergoApp').service('PlayListsService',
    function PlayListsService($http, $sce, $q, $window, VideoService, $log, $filter) {

        var self = this;

        this.create = function () {
            return $http.post('/backend/PlayLists/create'); // PlayListsController.js
        };

        // will get all playLists - including private.
        // if user not allowed, will return 400.
        // to get user's playLists, use UserDataService
        this.getAll = function (queryObj) {
            if (!queryObj) {
                throw new Error('should have at least a query object with pagination..');
            }
            return $http({
                'method': 'GET',
                'url': '/backend/playLists/get/all',
                'params': {
                    'query': queryObj
                }
            }).then(function (result) {
                _.each(result.data.data, function (value) {
                    value.image = self.getTitleImage(value);
                });
                return result;

            });
        };
        // playLists ==> PlayLists && Question ==>  PlayList (Jeff)
        this.getPlayListsWhoUseThisPlayList = function (questionId) {
            return $http.get('/backend/playLists/using/question/' + questionId);
        };

        this.overrideQuestion = function (playListId, questionId) {
            return $http.post('/backend/playLists/' + playListId + '/question/' + questionId + '/override');
        };

        this.delete = function (id) {
            return $http.post('/backend/playLists/' + id + '/delete');
        };

        this.getPermissions = function (id) {
            return $http.get('/backend/playLists/' + id + '/permissions');
        };

        this.update = function (playList) {
            return $http.post('/backend/playLists/' + playList._id + '/update', playList);
        };

        this.publish = function (playList) {
            return $http.post('/backend/playLists/' + playList._id + '/publish');
        };

        this.unpublish = function (playList) {
            return $http.post('/backend/playLists/' + playList._id + '/unpublish');
        };

        this.getById = function (id) {
            return $http.get('/backend/playLists/' + id);
        };

        this.findPlayListsById = function (ids) {
            return $http({
                'url': '/backend/playLists/find',
                'method': 'GET',
                params: {
                    'playListsId': ids
                }
            });
        };

        this.getPlayListIntro = function (id) {
            return $http.get('/backend/playLists/' + id + '/intro');
        };

        this.getPublicPlayLists = function (queryObj) {
            if (!queryObj) {
                throw new Error('you should at least have {"public" : { "exists" : 1 } } ');
            }
            return $http({
                'method': 'GET',
                'url': '/backend/public/playLists',
                'params': {'query': JSON.stringify(queryObj)} /* stringify the queryObj as it contains $ signs which angular filters out */
            });
        };

        this.copyPlayList = function (id) {
            return $http.post('/backend/playLists/' + id + '/copy');
        };

        var statsPromise = null;
        this.getStats = function (refresh) {
            if (statsPromise === null || !!refresh) {
                statsPromise = $http.get('/backend/system/statistics');
            }
            return statsPromise;

        };

        this.getTitleImage = function (playList) {

            if (!playList) {
                return;
            }
            if (!!playList.coverPage) {
                return playList.coverPage;
            }
            if (!playList.steps || playList.steps.length < 1) {
                return;
            }
            for (var i = 0; i < playList.steps.length; i++) {
                var id = this.getVideoId(playList.steps[i]);
                if (id !== null) {
                    return $sce.trustAsResourceUrl('https://img.youtube.com/vi/' + id + '/0.jpg');
                }
            }
        };

        /**
         *
         * @param {PlayList} item
         * @returns {number}
         */
        this.countQuestions = function (item) {
            try {
                return _.sumBy(item.steps, function (step) {
                    return step.type === 'quiz' ? _.size(step.quizItems) : 0;
                });
            } catch (e) {
                return 0;
            }
        };

        this.getVideoId = function (step) {
            var value = null;

            if (!!step && !!step.videoUrl) {
                try {
                    value = VideoService.getMedia(step.videoUrl).id;
                } catch (e) {
                    $log.error('unable to get video id', e);
                }
            }

            return value;
        };

        this.getShareLink = function (playList) {
            return $window.location.origin + '/index.html#!/public/playLists/' + playList._id + '/intro';
        };

        this.getIntroLink = function (playList) {
            return '/public/playLists/' + playList._id + '/intro';
        };

        this.createPlayListFromWrongQuestions = function (report, wrongQuestions) {
            return $q(function (resolve, reject) {
                if (!wrongQuestions || wrongQuestions.length === 0) {
                    reject();
                }
                self.create().then(function (result) {
                    var playList = result.data;
                    playList.name = $filter('translate')('playList.practice.title') + report.data.playList.name;
                    playList.language = report.data.playList.language;
                    playList.subject = report.data.playList.subject;
                    playList.steps = [];
                    var stepsWithoutRetry = _.filter(report.data.playList.steps, function (s) {
                        if (s.type === 'quiz') {
                            return !s.retryQuestion;
                        }
                    });
                    playList.description = report.data.playList.description;
                    playList.lastUpdate = new Date().getTime();
                    playList.temporary = true;
                    var step = {
                        'type': 'quiz',
                        'quizItems': [],
                        'testMode': 'False',
                        'retBefCrctAns': 1,
                        'shuffleQuestion': true,
                        retryQuestion: stepsWithoutRetry.length === 0
                    };
                    playList.steps.push(step);
                    playList.steps[0].quizItems = _.uniq(wrongQuestions);
                    self.update(playList).then(function () {
                        resolve(playList);
                    });
                });
            });
        };

    });
