'use strict';
 

angular.module('lergoApp').controller('PlaylistsIntroCtrl',
    function ($scope, $routeParams, LergoClient, $location, $uibModal, DisplayRoleService, $log, $rootScope, LergoTranslate, $window, $filter) {
        $window.scrollTo(0, 0);
        var playlistId = $routeParams.playlistId;
        var invitationId = $routeParams.invitationId;
        var preview = !!$routeParams.preview;
        var autoPlay = $routeParams.autoPlay;

        $scope.shareSection = 'link';


        function redirectToInvitation() {

            if (!$scope.playlist.temporary) {
                console.log('the routeparams is:' ,$routeParams );
                $location.path('/public/playlists/invitations/' + invitationId + '/display').search({
                    playlistId: $scope.playlist._id,
                    playlistRprtId: $routeParams.playlistRprtId,
                    currentStepIndex: 0 // required, otherwise we will get 'unsaved changes' alert
                });
            } else {
                $location.path('/public/playlists/invitations/' + invitationId + '/display').search({
                    playlistId: $scope.playlist._id
                }).replace();
            }
        }

        function redirectToPreview() {
            $location.path('/user/playlists/' + playlistId + '/display');

        }

        $scope.copyPlaylist = function () {
            $scope.copyBtnDisable = true;
            $scope.copyPlaylistPromise = LergoClient.playlists.copyPlaylist(playlistId);
            $scope.copyPlaylistPromise.then(function (result) {
                $location.path('/user/playlists/' + result.data._id + '/update');
            }, function (result) {
                $scope.copyBtnDisable = false;
                $log.error(result);
            });
        };

        var playlistLikeWatch = null;
        $scope.$watch('playlist', function loadLike(newValue) {
            if (!!newValue) {
                // get my like - will decide if I like this playlist or not
                LergoClient.likes.getMyPlaylistLike($scope.playlist).then(function (result) {
                    console.log('this is playlistLike...',result.data);
                    $scope.playlistLike = result.data;
                });

                if (playlistLikeWatch === null) {
                    playlistLikeWatch = $scope.$watch('playlistLike', function countLikes() {
                        // get count of likes for playlist
                        LergoClient.likes.countPlaylistLikes($scope.playlist).then(function (result) {
                            $scope.playlistLikes = result.data.count;
                        });
                    });
                }
            }
        });

        $scope.getPlaylistInvite = function () {
            LergoClient.playlistsInvitations.get(invitationId).then(function (result) {
                $scope.playlistInvitation = result;
            });
        };

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
        
        $scope.previewPlaylist = function () {

            // persistScroll();
            var modelContent = {};
            modelContent.templateUrl = 'views/playlist/preview/preview.html';
            modelContent.windowClass = 'playlist-preview-dialog ' + LergoTranslate.getDirection();
            modelContent.backdrop = 'static';
            modelContent.controller = 'PlaylistPreviewCtrl';
            modelContent.resolve = {
                playlist: function () {
                    return $scope.playlist;
                },
                lessons: function () {
                    return $scope.lessons;
                }
            };
            var modelInstance = $uibModal.open(modelContent);
            modelInstance.result.then(function () {
                //   scrollToPersistPosition();
            }, function () {
                //  scrollToPersistPosition();
            });
        };

        $scope.preview = function () {
            redirectToPreview();
        };

        $scope.showActionItems = function () {
            return DisplayRoleService.canSeeActionItemsOnPlaylistIntroPage();
        };

        $scope.deletePlaylist = function (playlist) {
            var str = $filter('translate')('deleteIntro.Confirm');
            var canDelete = confirm($filter('format')(str, {
                '0': playlist.name
            }));
            if (canDelete) {
                $scope.deletePlaylistPromise = LergoClient.playlists.delete(playlist._id);
                $scope.deletePlaylistPromise.then(function () {
                    $scope.errorMessage = null;
                    $log.info('Playlist deleted sucessfully');
                    $location.path('/user/create/playlists');
                }, function (result) {
                    $scope.errorMessage = 'Error in deleting Playlist : ' + result.data.message;
                    $log.error($scope.errorMessage);
                });
            }
        };

        $scope.noop = angular.noop;

        function getLessonsWithSummary() {
            return _.compact([].concat(_.find($scope.lessons || [], function (q) {
                return !!q.summary;
            })));
        }

        // we want to show edit summary in case this playlist is a copy of another
        // playlist
        // or if we have an edit summary on one of the lessons.

        // edit summary is used here as an abstraction and does not refer to the
        // lesson model field 'edit summary'

        $scope.showEditSummary = function () {

            // we want to keep the information about copyOf if copied from yourself.
            // we do not want to display it in the edit summary though
            if (!!$scope.playlist && !!$scope.playlist.copyOf && !!$scope.copyOfItems && _.size($scope.copyOfItems) > 0) {
                return true;
            }

            if (!!$scope.lessonsFromOthers && _.size($scope.lessonsFromOthers) > 0) {
                return true;
            }

            if (!!$scope.lessonsWeCopied && _.size($scope.lessonsWeCopied) > 0) {
                return true;
            }

            var withSummary = getLessonsWithSummary();
            return !!withSummary && withSummary.length > 0;
        };

        LergoClient.playlists.getPermissions(playlistId).then(function (result) {
            $scope.permissions = result.data;
        });

        $scope.showReadMore = function (filteredDescription) {

            $scope.more = !$scope.playlist || !$scope.playlist.description || $scope.playlist.description === '';
            return (!!$scope.playlist && !!$scope.playlist.description && !!filteredDescription && filteredDescription.length !== $scope.playlist.description.length) || $scope.showEditSummary();
        };

        $scope.startPlaylist = function () {

            if (!!preview) { // preview - no playlist playlistRprt, no invitation
                redirectToPreview();
            } else if (!invitationId) { // prepared invitation
                LergoClient.playlistsInvitations.createAnonymous(playlistId).then(function (result) {
                    invitationId = result.data._id;
                    console.log('the invitationId is', invitationId );
                    redirectToInvitation();
                });
            } else { // anonymous invitation
                redirectToInvitation();
            }
        };

        // enum{
        $scope.actionItems = {
            REPORT: 'playlistRprt',
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
        $scope.abusePlaylistRprt = {};
        $scope.submitAbusePlaylistRprt = function () {
            $scope.submit = true;
            LergoClient.abusePlaylistRprts.abusePlaylist($scope.abusePlaylistRprt, $scope.playlist);
        };

        $scope.isInvitationLink = function () {
            return !!invitationId;
        };

        function giveCreditToLessonsWeCopied(lessons) {

            var lessonsWeCopied = _.filter(lessons, 'copyOf');
            // find all lessons with copy of
            var lessonsWithCopyOf = _.compact(_.flatten(_.map(lessonsWeCopied, 'copyOf')));

            if (!!lessonsWithCopyOf && _.size(lessonsWithCopyOf) > 0) {
                // get all of these lessons
                LergoClient.lessons.findLessonsById(lessonsWithCopyOf).then(function (result) {
                    var originalLessons = result.data;

                    var usersWeCopiedFrom = _.uniq(_.compact(_.map(originalLessons, 'userId')));

                    // get all users we copied from..
                    LergoClient.users.findUsersById(usersWeCopiedFrom).then(function (result) {
                        var copyOfUsers = result.data;
                        // turn list of users to map where id is map
                        var copyOfUsersById = _.keyBy(copyOfUsers, '_id');

                        _.each(originalLessons, function (q) {
                            q.userDetails = copyOfUsersById[q.userId];
                        });

                        var originalsById = _.keyBy(originalLessons, '_id');

                        _.each(lessonsWeCopied, function (q) {
                            q.originals = _.map(q.copyOf, function (c) {
                                return originalsById[c];
                            });
                        });

                        /* map each lesson we copied to the original */
                        /*
                         * remove lesson that was created by the same user who
                         * owns this playlist
                         */
                        lessonsWeCopied = _.filter(lessonsWeCopied, function (q) {
                            return !_.isEmpty(_.reject(q.originals, {userId: $scope.playlist.userId}));
                        });

                        $scope.lessonsWeCopied = _.keyBy(lessonsWeCopied, '_id');
                    });
                });

            }
        }

        function giveCreditToLessonsWeUseFromOthers(lessons) {
            var lessonsFromOthers = _.reject(lessons, {userId: $scope.playlist.userId});
            var others = _.uniq(_.compact(_.map(lessonsFromOthers, 'userId')));

            if (!others || others.length === 0) {
                return;
            }

            LergoClient.users.findUsersById(others).then(function (result) {
                var othersUsers = result.data;
                var othersUsersById = _.keyBy(othersUsers, '_id');

                _.each(lessonsFromOthers, function (q) {
                    q.userDetails = othersUsersById[q.userId];
                });

                $scope.lessonsFromOthers = _.keyBy(lessonsFromOthers, '_id');
            });

        }

        function loadLessons() {

            var lessonsId = [];
            if (!!$scope.playlist && !!$scope.playlist.steps) {

                for (var i = 0; i < $scope.playlist.steps.length; i++) {
                    var items = $scope.playlist.steps[i].quizItems;
                    if (!!items && angular.isArray(items)) {
                        lessonsId.push.apply(lessonsId, items);
                    }
                }
                LergoClient.lessons.findLessonsById(lessonsId).then(function (result) {
                    $scope.lessons = result.data;
                    $scope.lessonsWithSummary = _.filter(result.data, 'summary');
                    giveCreditToLessonsWeUseFromOthers($scope.lessons);
                    giveCreditToLessonsWeCopied($scope.lessons);
                });
            }
        }

        // once we have the copyOf details, we need to fetch details about it like
        // users and playlists.
        // we only want to do this once. We can implement 'unregister' or simply
        // return at the beginning.
        // either way is fine with me.
        $scope.$watch('playlist', function loadCopyOfDetails(newValue) {
            if (!!$scope.copyOfItem) {
                return;

            }

            if (!!newValue) {
                $scope.shareLink = LergoClient.playlists.getShareLink(newValue);
                $scope.embedCode = '<iframe src="' + $scope.shareLink + '" height="900" width="600" frameBorder="0"></iframe>';
            }

            if (!!newValue && !!newValue.copyOf) {
                LergoClient.playlists.findPlaylistsById([].concat(newValue.copyOf)).then(function (result) {
                    // we want to keep the information about copyOf if copied from
                    // yourself.
                    // we do not want to display it in the edit summary though
                    var copyOfPlaylists = _.compact(_.reject(result.data, {'userId': $scope.playlist.userId}));
                    LergoClient.users.findUsersById(_.map(copyOfPlaylists, 'userId')).then(function (result) {
                        var copyOfUsers = result.data;
                        // turn list of users to map
                        var copyOfUsersById = _.keyBy(copyOfUsers, '_id');

                        _.each(copyOfPlaylists, function (l) {
                            l.userDetails = copyOfUsersById[l.userId];
                        });

                        $scope.copyOfItems = copyOfPlaylists;

                    });
                });
            }
        });

        LergoClient.playlists.getPlaylistIntro(playlistId).then(function (result) {
            $scope.playlist = result.data;
            $rootScope.page = {
                'title': $scope.playlist.name,
                'description': $scope.playlist.description
            };
            loadLessons();
            LergoTranslate.setLanguageByName($scope.playlist.language);
            if (!!autoPlay) {
                $scope.startPlaylist();
            }
        }, function (result) {
            if (result.status === 404) {
                $location.path('/errors/notFound');
            }
        });

    });
