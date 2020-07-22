'use strict';

angular.module('lergoApp').controller('PlaylistsInvitationsDisplayCtrl',
    function ($window, $scope, $filter, LergoClient, LessonsService, PlaylistsService, LergoTranslate, $location, $routeParams, $log, $controller, ContinuousSavePlaylistRprts, $rootScope) {
        $window.scrollTo(0, 0);
        $log.info('loading invitation');
        var errorWhileSaving = false;
        $scope.shareSection = 'link';
        var updateChange = new ContinuousSavePlaylistRprts({

            'saveFn': function (value) {
               /* window.scrollTo(0, 68);*/
                $log.info('updating playlistRprt');
                var finished = value.finished; // value.data is the invitation. we
                // want the playlistRprt.

                if (finished) {
                    getWrongLesson(value);
                }
                console.log('----------------------commenting out all the report update code');
                return ''

                // return LergoClient.playlistRprts.update(value).then(function (result) {
                //     if (finished) {
                //         if (errorWhileSaving) {
                //             toastr.success($filter('translate')('playlistRprt.saved.successfully'));
                //         }
                //         errorWhileSaving = false;
                //         if (!$scope.invitation.anonymous && !!$scope.invitation.emailNotification) {
                //             LergoClient.playlistRprts.ready($routeParams.playlistRprtId);
                //         } else {
                //             $log.info('not sending playlistRprt link because anonymous');
                //         }
                //     }
                //     return result;
                // }, function (result) {
                //     if (finished) {
                //         errorWhileSaving = true;
                //         toastr.error($filter('translate')('playlistRprt.error.while.updating'));
                //         $log.error('error while updating playlistRprt', result.data);
                //     }
                //     return result;
                // });

            }
        });

        $scope.isValid = function(quizItem) {
            if (!quizItem || !quizItem.type) {
                return false;
            }
            return LessonsService.getTypeById(quizItem.type).isValid(quizItem);
        };

        function initializePlaylistRprt(invitation) {
            /**  
             *   for playlist,this is not needed
             *      prior to creating a new playlistRprt and starting a playlist, check that the playlist is valid 
             *      first check if each quiz item is valid - if not, remove from local playlist and playlist in dB and lessonId in dB
             *      then check that each step is valid - remove locally and on dB
            */
            // var steps = invitation.playlist.steps;
            // var quizItems = invitation.quizItems;
            // for (var k = quizItems.length -1; k >= 0; k--) {
            //     if ($scope.isValid(quizItems[k])) {
            //         $log.debug('valid quizItem');
            //     } else {
            //         var illegalId = quizItems[k]._id;
            //         quizItems.splice(quizItems.indexOf(illegalId), 1);
            //         for (var i = steps.length -1; i >= 0; i--) {
            //             if (steps[i].quizItems) {
            //                 for (var j = steps[i].quizItems.length -1; j >= 0; j--) {
            //                     var lessonId = steps[i].quizItems[j];
            //                     if (lessonId === illegalId){
            //                         steps[i].quizItems.splice(steps[i].quizItems.indexOf(illegalId), 1);
            //                         $log.info('fixing playlist locally');
            //                         $log.info('updating fixed playlist on Db');
            //                         LergoClient.playlists.fix(invitation.playlist);
            //                         $log.info('deleting invalid lesson on Db');
            //                         LessonsService.removeLesson(lessonId);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
           
            // for (var l = steps.length -1; l >= 0; l--) {
            //     if (!PlaylistsService.checkIfStepIsValid(steps[l])) {
            //         $log.info('deleting invalid step locally ',l);
            //         steps.splice(l, 1);
            //         $log.info('removing step on Db');
            //         LergoClient.playlists.fix(invitation.playlist);
            //     }
            // }
           
            // broadcast start of playlist
            function initializePlaylistRprtWriter(playlistRprt) {
                $scope.playlistRprt = playlistRprt;
                $scope.$watch('playlistRprt', updateChange.onValueChange, true);
                $controller('PlaylistsPlaylistRprtWriteCtrl', {
                    $scope: $scope
                });

                $controller('PlaylistsDisplayCtrl', {
                    $scope: $scope
                }); // display should be initialized here, we should not show playlist
                // before we can playlistRprt.
                $rootScope.$broadcast('startPlaylist', invitation);
            }

            var playlistRprtId = $routeParams.playlistRprtId;
            if (!!playlistRprtId) {
                LergoClient.playlistRprts.getById(playlistRprtId).then(function (result) {

                    initializePlaylistRprtWriter(result.data);
                });
            } else {
                LergoClient.playlistRprts.createFromInvitation(invitation).then(function (result) {
                    $location.search('playlistRprtId', result.data._id).replace();
                    initializePlaylistRprtWriter(result.data);
                });
            }
        }

        // todo : do a test for invitation.finished = true
        $scope.$watch(function () { // broadcast end of playlist if not next step
            return !!$scope.invitation && !!$scope.hasNextStep && !$scope.hasNextStep();
        }, function (newValue/* , oldValue */) {
            if (!!newValue) {
                // just notify end playlist. do nothing else. wait for playlistRprt to
                // update.
                $rootScope.$broadcast('endPlaylist');
                if (!!$scope.invitation) {
                    $scope.invitation.finished = true;
                    LergoClient.playlistsInvitations.update($scope.invitation);
                }
            }
        });

        // todo: technically we don't need to build playlist invitation anymore..
        // todo: we should build the playlistRprt instead since all data is on the playlistRprt and display the data from there.
        // todo: the display will still be for playlist invitation, but the data should come from playlistRprt. (this resolves ambiguity regarding display for playlistRprt.. there's only one).
        LergoClient.playlistsInvitations.build($routeParams.invitationId, true, false).then(function (result) {
            $scope.invitation = result.data;
            $scope.playlist = result.data.playlist;
            $scope.playlist.image = LergoClient.playlists.getTitleImage($scope.playlist);
            $scope.lessons = {};

            $scope.shareLink = LergoClient.playlists.getShareLink($scope.playlist);
            $scope.embedCode = '<iframe src="' + $scope.shareLink + '" height="900" width="600" frameBorder="0"></iframe>';

            initializePlaylistRprt($scope.invitation);
            var items = result.data.quizItems;
            if (!items) {
                return;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                $scope.lessons[item._id] = item;

            }
        }, function (result) {
            if (result.status) { // playlist invitation might not be found if was temporary. temporary playlists are deleted on finish. (@see Write.js 'endPlaylist' event)
               // incase the invitation is deleted and user tries to "start over" or "continue playlist"
                // we should insert anonymous invitation
                if (!!$routeParams.playlistId) {
                    LergoClient.playlistsInvitations.createAnonymous($routeParams.playlistId).then(function (result) {
                        var invitation = result.data;
                        $location.path('/public/playlists/invitations/' + invitation._id + '/display');
                    });
                } else {
                    $location.path('/errors/notFound');
                }
            }
        });

        $scope.actionItems = {
            INVITE: 'invite',
            SHARE: 'share'
        };
        var activeAction = null;
        $scope.setActiveAction = function (actionItem) {
            if (activeAction === actionItem) {
                activeAction = null;
            } else {
                activeAction = actionItem;
            }
        };
        $scope.isActiveAction = function (actionItem) {
            return activeAction === actionItem;
        };

        $scope.startPlaylist = function (playlistId) {
            if (!playlistId) {
                redirectToInvitation($scope.playlist._id, $scope.invitation._id);
            } else {
                LergoClient.playlistsInvitations.createAnonymous(playlistId).then(function (result) {
                    redirectToInvitation(playlistId, result.data._id);
                });
            }
        };
        function redirectToInvitation(playlistId, invId) {
            // in case of temporary playlist we don't want to remember history
            if (!$scope.playlist.temporary) {
                $location.path('/public/playlists/' + playlistId + '/intro').search({
                    invitationId: invId,
                    autoPlay: true
                });
            } else {
                $location.path('/public/playlists/' + playlistId + '/intro').search({
                    invitationId: invId,
                    autoPlay: true
                }).replace();
            }
        }


        var playlistLikeWatch = null;
        $scope.$watch('playlist', function (newValue) {
            if (!!newValue) {
                // get my like - will decide if I like this playlist or not
                LergoClient.likes.getMyPlaylistLike($scope.playlist).then(function (result) {
                    $scope.playlistLike = result.data;
                });

                if (playlistLikeWatch === null) {
                    playlistLikeWatch = $scope.$watch('playlistLike', function () {
                        // get count of likes for playlist
                        LergoClient.likes.countPlaylistLikes($scope.playlist).then(function (result) {
                            $scope.playlistLikes = result.data.count;
                        });
                    });
                }
            }
        });

        $scope.likePlaylist = function () {
            $log.info('liking playlist');
            LergoClient.likes.likePlaylist($scope.playlist).then(function (result) {
                $scope.playlistLike = result.data;
            });
        };

        $scope.unlikePlaylist = function () {
            $log.info('unliking playlist');
            LergoClient.likes.deletePlaylistLike($scope.playlist).then(function () {
                $scope.playlistLike = null;
            });
        };

        $scope.isLiked = function () {
            return !!$scope.playlistLike;
        };

        $scope.practiceMistakes = function () {
            $scope.practiseBtnDisable = true;
            LergoClient.playlists.createPlaylistFromWrongLessons($scope.playlistRprt, $scope.wrongLessons).then(
                function (playlist) {
                    $log.info('Starting practice mistakes');
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

        // function createPlaylistFromWrongLessons() {
        //     if ($scope.wrongLessons.length > 0) {
        //         var playlistRprt = $scope.playlistRprt;
        //         LergoClient.playlists.create().then(function (result) {
        //             var playlist = result.data;
        //             playlist.name = $filter('translate')('playlist.practice.title') + playlistRprt.data.playlist.name;
        //
        //             playlist.language = LergoTranslate.getLanguageObject().name;
        //             playlist.subject = playlistRprt.data.playlist.subject;
        //             playlist.steps = [];
        //             var stepsWithoutRetry = _.filter(playlistRprt.data.playlist.steps, function (s) {
        //                 if (s.type === 'quiz') {
        //                     return !s.retryLesson;
        //                 }
        //             });
        //
        //             playlist.description = playlistRprt.data.playlist.description;
        //             playlist.lastUpdate = new Date().getTime();
        //             playlist.temporary = true;
        //             var step = {
        //                 'type': 'quiz',
        //                 'quizItems': [],
        //                 'testMode': 'False',
        //                 'shuffleLesson': true,
        //                 retryLesson: stepsWithoutRetry.length === 0
        //             };
        //             playlist.steps.push(step);
        //
        //             // NOTE: using unique here on purpose.
        //             // because we don't support repeating same lesson in the same quiz.
        //             // the answers model in StepDisplay assumes uniqueness.
        //
        //             playlist.steps[0].quizItems = _.uniq($scope.wrongLessons);
        //             LergoClient.playlists.update(playlist).then(function () {
        //                 $scope.startPlaylist(playlist._id);
        //                 $scope.practiseBtnDisable = false;
        //             });
        //         });
        //     }
        //
        // }

        $scope.showPlaylistRprt = function () {
            // in case of temporary playlist we don't want to remember history
            if (!$scope.playlist.temporary) {
                $location.path('/public/playlists/playlistRprts/' + $scope.playlistRprt._id + '/display');
            } else {
                $location.path('/public/playlists/playlistRprts/' + $scope.playlistRprt._id + '/display').replace();
            }
        };

    });
