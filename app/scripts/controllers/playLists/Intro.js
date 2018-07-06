'use strict';

angular.module('lergoApp').controller('PlayListsIntroCtrl',
    function ($scope, $routeParams, LergoClient, $location, $uibModal, DisplayRoleService, $log, $rootScope, LergoTranslate, $window, $filter) {
        $window.scrollTo(0, 0);
        var playListId = $routeParams.playListId;
        var invitationId = $routeParams.invitationId;
        var preview = !!$routeParams.preview;
        var autoPlay = $routeParams.autoPlay;

        $scope.shareSection = 'link';


        function redirectToInvitation() {

            if (!$scope.playList.temporary) {
                $location.path('/public/playLists/invitations/' + invitationId + '/display').search({
                    playListId: $scope.playList._id,
                    reportId: $routeParams.reportId,
                    currentStepIndex: 0 // required, otherwise we will get 'unsaved changes' alert
                });
            } else {
                $location.path('/public/playLists/invitations/' + invitationId + '/display').search({
                    playListId: $scope.playList._id
                }).replace();
            }
        }

        function redirectToPreview() {
            $location.path('/user/playLists/' + playListId + '/display');

        }

        $scope.copyPlayList = function () {
            $scope.copyBtnDisable = true;
            $scope.copyPlayListPromise = LergoClient.playLists.copyPlayList(playListId);
            $scope.copyPlayListPromise.then(function (result) {
                $location.path('/user/playLists/' + result.data._id + '/update');
            }, function (result) {
                $scope.copyBtnDisable = false;
                $log.error(result);
            });
        };

        var playListLikeWatch = null;
        $scope.$watch('playList', function loadLike(newValue) {
            if (!!newValue) {
                // get my like - will decide if I like this playList or not
                LergoClient.likes.getMyPlayListLike($scope.playList).then(function (result) {
                    $scope.playListLike = result.data;
                });

                if (playListLikeWatch === null) {
                    playListLikeWatch = $scope.$watch('playListLike', function countLikes() {
                        // get count of likes for playList
                        LergoClient.likes.countPlayListLikes($scope.playList).then(function (result) {
                            $scope.playListLikes = result.data.count;
                        });
                    });
                }
            }
        });

        $scope.likePlayList = function () {
            $log.info('liking playList');
            LergoClient.likes.likePlayList($scope.playList).then(function (result) {
                $scope.playListLike = result.data;
            });
        };

        $scope.unlikePlayList = function () {
            $log.info('unliking playList');
            LergoClient.likes.deletePlayListLike($scope.playList).then(function () {
                $scope.playListLike = null;
            });
        };

        $scope.isLiked = function () {
            return !!$scope.playListLike;
        };


        $scope.previewPlayList = function () {

            // persistScroll();
            var modelContent = {};
            modelContent.templateUrl = 'views/playList/preview/preview.html';
            modelContent.windowClass = 'playList-preview-dialog ' + LergoTranslate.getDirection();
            modelContent.backdrop = 'static';
            modelContent.controller = 'PlayListPreviewCtrl';
            modelContent.resolve = {
                playList: function () {
                    return $scope.playList;
                },
                questions: function () {
                    return $scope.questions;
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
            return DisplayRoleService.canSeeActionItemsOnPlayListIntroPage();
        };

        $scope.deletePlayList = function (playList) {
            var str = $filter('translate')('deleteIntro.Confirm');
            var canDelete = confirm($filter('format')(str, {
                '0': playList.name
            }));
            if (canDelete) {
                $scope.deletePlayListPromise = LergoClient.playLists.delete(playList._id);
                $scope.deletePlayListPromise.then(function () {
                    $scope.errorMessage = null;
                    $log.info('PlayList deleted sucessfully');
                    $location.path('/user/create/playLists');
                }, function (result) {
                    $scope.errorMessage = 'Error in deleting PlayList : ' + result.data.message;
                    $log.error($scope.errorMessage);
                });
            }
        };

        $scope.noop = angular.noop;

        function getQuestionsWithSummary() {
            return _.compact([].concat(_.find($scope.questions || [], function (q) {
                return !!q.summary;
            })));
        }

        // we want to show edit summary in case this playList is a copy of another
        // playList
        // or if we have an edit summary on one of the questions.

        // edit summary is used here as an abstraction and does not refer to the
        // question model field 'edit summary'

        $scope.showEditSummary = function () {

            // we want to keep the information about copyOf if copied from yourself.
            // we do not want to display it in the edit summary though
            if (!!$scope.playList && !!$scope.playList.copyOf && !!$scope.copyOfItems && _.size($scope.copyOfItems) > 0) {
                return true;
            }

            if (!!$scope.questionsFromOthers && _.size($scope.questionsFromOthers) > 0) {
                return true;
            }

            if (!!$scope.questionsWeCopied && _.size($scope.questionsWeCopied) > 0) {
                return true;
            }

            var withSummary = getQuestionsWithSummary();
            return !!withSummary && withSummary.length > 0;
        };

        LergoClient.playLists.getPermissions(playListId).then(function (result) {
            $scope.permissions = result.data;
        });

        $scope.showReadMore = function (filteredDescription) {

            $scope.more = !$scope.playList || !$scope.playList.description || $scope.playList.description === '';
            return (!!$scope.playList && !!$scope.playList.description && !!filteredDescription && filteredDescription.length !== $scope.playList.description.length) || $scope.showEditSummary();
        };

        $scope.startPlayList = function () {

            if (!!preview) { // preview - no playList report, no invitation
                redirectToPreview();
            } else if (!invitationId) { // prepared invitation
                LergoClient.playListsInvitations.createAnonymous(playListId).then(function (result) {
                    invitationId = result.data._id;
                    redirectToInvitation();
                });
            } else { // anonymous invitation
                redirectToInvitation();
            }
        };

        // enum{
        $scope.actionItems = {
            REPORT: 'report',
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
        $scope.abuseReport = {};
        $scope.submitAbuseReport = function () {
            $scope.submit = true;
            LergoClient.abuseReports.abusePlayList($scope.abuseReport, $scope.playList);
        };

        $scope.isInvitationLink = function () {
            return !!invitationId;
        };

        function giveCreditToQuestionsWeCopied(questions) {

            var questionsWeCopied = _.filter(questions, 'copyOf');
            // find all questions with copy of
            var questionsWithCopyOf = _.compact(_.flatten(_.map(questionsWeCopied, 'copyOf')));

            if (!!questionsWithCopyOf && _.size(questionsWithCopyOf) > 0) {
                // get all of these questions
                LergoClient.questions.findQuestionsById(questionsWithCopyOf).then(function (result) {
                    var originalQuestions = result.data;

                    var usersWeCopiedFrom = _.uniq(_.compact(_.map(originalQuestions, 'userId')));

                    // get all users we copied from..
                    LergoClient.users.findUsersById(usersWeCopiedFrom).then(function (result) {
                        var copyOfUsers = result.data;
                        // turn list of users to map where id is map
                        var copyOfUsersById = _.keyBy(copyOfUsers, '_id');

                        _.each(originalQuestions, function (q) {
                            q.userDetails = copyOfUsersById[q.userId];
                        });

                        var originalsById = _.keyBy(originalQuestions, '_id');

                        _.each(questionsWeCopied, function (q) {
                            q.originals = _.map(q.copyOf, function (c) {
                                return originalsById[c];
                            });
                        });

                        /* map each question we copied to the original */
                        /*
                         * remove question that was created by the same user who
                         * owns this playList
                         */
                        questionsWeCopied = _.filter(questionsWeCopied, function (q) {
                            return !_.isEmpty(_.reject(q.originals, {userId: $scope.playList.userId}));
                        });

                        $scope.questionsWeCopied = _.keyBy(questionsWeCopied, '_id');
                    });
                });

            }
        }

        function giveCreditToQuestionsWeUseFromOthers(questions) {
            var questionsFromOthers = _.reject(questions, {userId: $scope.playList.userId});
            var others = _.uniq(_.compact(_.map(questionsFromOthers, 'userId')));

            if (!others || others.length === 0) {
                return;
            }

            LergoClient.users.findUsersById(others).then(function (result) {
                var othersUsers = result.data;
                var othersUsersById = _.keyBy(othersUsers, '_id');

                _.each(questionsFromOthers, function (q) {
                    q.userDetails = othersUsersById[q.userId];
                });

                $scope.questionsFromOthers = _.keyBy(questionsFromOthers, '_id');
            });

        }

        function loadQuestions() {

            var questionsId = [];
            if (!!$scope.playList && !!$scope.playList.steps) {

                for (var i = 0; i < $scope.playList.steps.length; i++) {
                    var items = $scope.playList.steps[i].quizItems;
                    if (!!items && angular.isArray(items)) {
                        questionsId.push.apply(questionsId, items);
                    }
                }
                LergoClient.questions.findQuestionsById(questionsId).then(function (result) {
                    $scope.questions = result.data;
                    $scope.questionsWithSummary = _.filter(result.data, 'summary');
                    giveCreditToQuestionsWeUseFromOthers($scope.questions);
                    giveCreditToQuestionsWeCopied($scope.questions);
                });
            }
        }

        // once we have the copyOf details, we need to fetch details about it like
        // users and playLists.
        // we only want to do this once. We can implement 'unregister' or simply
        // return at the beginning.
        // either way is fine with me.
        $scope.$watch('playList', function loadCopyOfDetails(newValue) {
            if (!!$scope.copyOfItem) {
                return;

            }

            if (!!newValue) {
                $scope.shareLink = LergoClient.playLists.getShareLink(newValue);
                $scope.embedCode = '<iframe src="' + $scope.shareLink + '" height="900" width="600" frameBorder="0"></iframe>';
            }

            if (!!newValue && !!newValue.copyOf) {
                LergoClient.playLists.findPlayListsById([].concat(newValue.copyOf)).then(function (result) {
                    // we want to keep the information about copyOf if copied from
                    // yourself.
                    // we do not want to display it in the edit summary though
                    var copyOfPlayLists = _.compact(_.reject(result.data, {'userId': $scope.playList.userId}));
                    LergoClient.users.findUsersById(_.map(copyOfPlayLists, 'userId')).then(function (result) {
                        var copyOfUsers = result.data;
                        // turn list of users to map
                        var copyOfUsersById = _.keyBy(copyOfUsers, '_id');

                        _.each(copyOfPlayLists, function (l) {
                            l.userDetails = copyOfUsersById[l.userId];
                        });

                        $scope.copyOfItems = copyOfPlayLists;

                    });
                });
            }
        });

        LergoClient.playLists.getPlayListIntro(playListId).then(function (result) {
            $scope.playList = result.data;
            $rootScope.page = {
                'title': $scope.playList.name,
                'description': $scope.playList.description
            };
            loadQuestions();
            LergoTranslate.setLanguageByName($scope.playList.language);
            if (!!autoPlay) {
                $scope.startPlayList();
            }
        }, function (result) {
            if (result.status === 404) {
                $location.path('/errors/notFound');
            }
        });

    });
