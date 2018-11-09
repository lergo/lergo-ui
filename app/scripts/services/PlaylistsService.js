'use strict';

angular.module('lergoApp').service('PlaylistsService',
    function PlaylistsService($http, $sce, $q, $window, VideoService, $log, $filter) {

        var self = this;

        this.create = function () {
            return $http.post('/backend/Playlists/create'); // PlaylistsController.js
        };

        // will get all playlists - including private.
        // if user not allowed, will return 400.
        // to get user's playlists, use UserDataService
        this.getAll = function (queryObj) {
            if (!queryObj) {
                throw new Error('should have at least a query object with pagination..');
            }
            return $http({
                'method': 'GET',
                'url': '/backend/playlists/get/all',
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
        // playlists ==> Playlists && Question ==>  Playlist (Jeff)
        this.getPlaylistsWhoUseThisPlaylist = function (questionId) {
            return $http.get('/backend/playlists/using/question/' + questionId);
        };

        this.overrideQuestion = function (playlistId, questionId) {
            return $http.post('/backend/playlists/' + playlistId + '/question/' + questionId + '/override');
        };

        this.delete = function (id) {
            return $http.post('/backend/playlists/' + id + '/delete');
        };

        this.getPermissions = function (id) {
            return $http.get('/backend/playlists/' + id + '/permissions');
        };

        this.update = function (playlist) {
            return $http.post('/backend/playlists/' + playlist._id + '/update', playlist);
        };

        this.publish = function (playlist) {
            return $http.post('/backend/playlists/' + playlist._id + '/publish');
        };

        this.unpublish = function (playlist) {
            return $http.post('/backend/playlists/' + playlist._id + '/unpublish');
        };

        this.getById = function (id) {
            return $http.get('/backend/playlists/' + id);
        };

        this.findPlaylistsById = function (ids) {
            return $http({
                'url': '/backend/playlists/find',
                'method': 'GET',
                params: {
                    'playlistsId': ids
                }
            });
        };

        this.getPlaylistIntro = function (id) {
            return $http.get('/backend/playlists/' + id + '/intro');
        };

        this.getPublicPlaylists = function (queryObj) {
            if (!queryObj) {
                throw new Error('you should at least have {"public" : { "exists" : 1 } } ');
            }
            return $http({
                'method': 'GET',
                'url': '/backend/public/playlists',
                'params': {'query': JSON.stringify(queryObj)} /* stringify the queryObj as it contains $ signs which angular filters out */
            });
        };

        this.copyPlaylist = function (id) {
            return $http.post('/backend/playlists/' + id + '/copy');
        };

        var statsPromise = null;
        this.getStats = function (refresh) {
            if (statsPromise === null || !!refresh) {
                statsPromise = $http.get('/backend/system/statistics');
            }
            return statsPromise;

        };

        this.getTitleImage = function (playlist) {

            if (!playlist) {
                return;
            }
            if (!!playlist.coverPage) {
                return playlist.coverPage;
            }
            if (!playlist.steps || playlist.steps.length < 1) {
                return;
            }
            for (var i = 0; i < playlist.steps.length; i++) {
                var id = this.getVideoId(playlist.steps[i]);
                if (id !== null) {
                    return $sce.trustAsResourceUrl('https://img.youtube.com/vi/' + id + '/0.jpg');
                }
            }
        };

        /**
         *
         * @param {Playlist} item
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

        this.countLessons = function (item) {
            try {
                return _.sumBy(item.steps, function (step) {
                    return step.type === 'lesson' ? _.size(step.quizItems) : 0;
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

        this.getShareLink = function (playlist) {
            return $window.location.origin + '/index.html#!/public/playlists/' + playlist._id + '/intro';
        };

        this.getIntroLink = function (playlist) {
            return '/public/playlists/' + playlist._id + '/intro';
        };

        this.createPlaylistFromWrongQuestions = function (report, wrongQuestions) {
            return $q(function (resolve, reject) {
                if (!wrongQuestions || wrongQuestions.length === 0) {
                    reject();
                }
                self.create().then(function (result) {
                    var playlist = result.data;
                    playlist.name = $filter('translate')('playlist.practice.title') + report.data.playlist.name;
                    playlist.language = report.data.playlist.language;
                    playlist.subject = report.data.playlist.subject;
                    playlist.steps = [];
                    var stepsWithoutRetry = _.filter(report.data.playlist.steps, function (s) {
                        if (s.type === 'quiz') {
                            return !s.retryQuestion;
                        }
                    });
                    playlist.description = report.data.playlist.description;
                    playlist.lastUpdate = new Date().getTime();
                    playlist.temporary = true;
                    var step = {
                        'type': 'quiz',
                        'quizItems': [],
                        'testMode': 'False',
                        'retBefCrctAns': 1,
                        'shuffleQuestion': true,
                        retryQuestion: stepsWithoutRetry.length === 0
                    };
                    playlist.steps.push(step);
                    playlist.steps[0].quizItems = _.uniq(wrongQuestions);
                    self.update(playlist).then(function () {
                        resolve(playlist);
                    });
                });
            });
        };

    });
