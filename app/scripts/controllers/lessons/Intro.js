'use strict';

angular.module('lergoApp').controller('LessonsIntroCtrl',
    function ($scope, $routeParams, LergoClient, $location, $uibModal, DisplayRoleService, $log, $rootScope, LergoTranslate, $window, $filter) {
        $window.scrollTo(0, 0);
        var lessonId = $routeParams.lessonId;
        var invitationId = $routeParams.invitationId;
        var preview = !!$routeParams.preview;
        var autoPlay = $routeParams.autoPlay;

        $scope.shareSection = 'link';


        function redirectToInvitation() {

            if (!$scope.lesson.temporary) {
                $location.path('/public/lessons/invitations/' + invitationId + '/display').search({
                    lessonId: $scope.lesson._id,
                    reportId: $routeParams.reportId,
                    currentStepIndex: 0 // required, otherwise we will get 'unsaved changes' alert
                });
            } else {
                $location.path('/public/lessons/invitations/' + invitationId + '/display').search({
                    lessonId: $scope.lesson._id
                }).replace();
            }
        }

        function redirectToPreview() {
            $location.path('/user/lessons/' + lessonId + '/display');

        }

        $scope.copyLesson = function () {
            $scope.copyBtnDisable = true;
            $scope.copyLessonPromise = LergoClient.lessons.copyLesson(lessonId);
            $scope.copyLessonPromise.then(function (result) {
                $location.path('/user/lessons/' + result.data._id + '/update');
            }, function (result) {
                $scope.copyBtnDisable = false;
                $log.error(result);
            });
        };

        var lessonLikeWatch = null;
        $scope.$watch('lesson', function loadLike(newValue) {
            if (!!newValue) {
                // get my like - will decide if I like this lesson or not
                LergoClient.likes.getMyLessonLike($scope.lesson).then(function (result) {
                    $scope.lessonLike = result.data;
                });

                if (lessonLikeWatch === null) {
                    lessonLikeWatch = $scope.$watch('lessonLike', function countLikes() {
                        // get count of likes for lesson
                        LergoClient.likes.countLessonLikes($scope.lesson).then(function (result) {
                            $scope.lessonLikes = result.data.count;
                        });
                    });
                }
            }
        });

        $scope.likeLesson = function () {
            $log.info('liking lesson');
            LergoClient.likes.likeLesson($scope.lesson).then(function (result) {
                $scope.lessonLike = result.data;
            });
        };

        $scope.unlikeLesson = function () {
            $log.info('unliking lesson');
            LergoClient.likes.deleteLessonLike($scope.lesson).then(function () {
                $scope.lessonLike = null;
            });
        };

        $scope.isLiked = function () {
            return !!$scope.lessonLike;
        };


        $scope.previewLesson = function () {

            // persistScroll();
            var modelContent = {};
            modelContent.templateUrl = 'views/lesson/preview/preview.html';
            modelContent.windowClass = 'lesson-preview-dialog ' + LergoTranslate.getDirection();
            modelContent.backdrop = 'static';
            modelContent.controller = 'LessonPreviewCtrl';
            modelContent.resolve = {
                lesson: function () {
                    return $scope.lesson;
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
            return DisplayRoleService.canSeeActionItemsOnLessonIntroPage();
        };

        $scope.deleteLesson = function (lesson) {
            var str = $filter('translate')('deleteIntro.Confirm');
            var canDelete = confirm($filter('format')(str, {
                '0': lesson.name
            }));
            if (canDelete) {
                $scope.deleteLessonPromise = LergoClient.lessons.delete(lesson._id);
                $scope.deleteLessonPromise.then(function () {
                    $scope.errorMessage = null;
                    $log.info('Lesson deleted sucessfully');
                    $location.path('/user/create/lessons');
                }, function (result) {
                    $scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
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

        // we want to show edit summary in case this lesson is a copy of another
        // lesson
        // or if we have an edit summary on one of the questions.

        // edit summary is used here as an abstraction and does not refer to the
        // question model field 'edit summary'

        $scope.showEditSummary = function () {

            // we want to keep the information about copyOf if copied from yourself.
            // we do not want to display it in the edit summary though
            if (!!$scope.lesson && !!$scope.lesson.copyOf && !!$scope.copyOfItems && _.size($scope.copyOfItems) > 0) {
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

        LergoClient.lessons.getPermissions(lessonId).then(function (result) {
            $scope.permissions = result.data;
        });

        $scope.showReadMore = function (filteredDescription) {

            $scope.more = !$scope.lesson || !$scope.lesson.description || $scope.lesson.description === '';
            return (!!$scope.lesson && !!$scope.lesson.description && !!filteredDescription && filteredDescription.length !== $scope.lesson.description.length) || $scope.showEditSummary();
        };

        $scope.startLesson = function () {

            if (!!preview) { // preview - no lesson report, no invitation
                redirectToPreview();
            } else if (!invitationId) { // prepared invitation
                LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function (result) {
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
            LergoClient.abuseReports.abuseLesson($scope.abuseReport, $scope.lesson);
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
                         * owns this lesson
                         */
                        questionsWeCopied = _.filter(questionsWeCopied, function (q) {
                            return !_.isEmpty(_.reject(q.originals, {userId: $scope.lesson.userId}));
                        });

                        $scope.questionsWeCopied = _.keyBy(questionsWeCopied, '_id');
                    });
                });

            }
        }

        function giveCreditToQuestionsWeUseFromOthers(questions) {
            var questionsFromOthers = _.reject(questions, {userId: $scope.lesson.userId});
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
            if (!!$scope.lesson && !!$scope.lesson.steps) {

                for (var i = 0; i < $scope.lesson.steps.length; i++) {
                    var items = $scope.lesson.steps[i].quizItems;
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
        // users and lessons.
        // we only want to do this once. We can implement 'unregister' or simply
        // return at the beginning.
        // either way is fine with me.
        $scope.$watch('lesson', function loadCopyOfDetails(newValue) {
            if (!!$scope.copyOfItem) {
                return;

            }

            if (!!newValue) {
                $scope.shareLink = LergoClient.lessons.getShareLink(newValue);
                $scope.embedCode = '<iframe src="' + $scope.shareLink + '" height="900" width="600" frameBorder="0"></iframe>';
            }

            if (!!newValue && !!newValue.copyOf) {
                LergoClient.lessons.findLessonsById([].concat(newValue.copyOf)).then(function (result) {
                    // we want to keep the information about copyOf if copied from
                    // yourself.
                    // we do not want to display it in the edit summary though
                    var copyOfLessons = _.compact(_.reject(result.data, {'userId': $scope.lesson.userId}));
                    LergoClient.users.findUsersById(_.map(copyOfLessons, 'userId')).then(function (result) {
                        var copyOfUsers = result.data;
                        // turn list of users to map
                        var copyOfUsersById = _.keyBy(copyOfUsers, '_id');

                        _.each(copyOfLessons, function (l) {
                            l.userDetails = copyOfUsersById[l.userId];
                        });

                        $scope.copyOfItems = copyOfLessons;

                    });
                });
            }
        });

        LergoClient.lessons.getLessonIntro(lessonId).then(function (result) {
            $scope.lesson = result.data;
            $rootScope.page = {
                'title': $scope.lesson.name,
                'description': $scope.lesson.description
            };
            loadQuestions();
            LergoTranslate.setLanguageByName($scope.lesson.language);
            if (!!autoPlay) {
                $scope.startLesson();
            }
        }, function (result) {
            if (result.status === 404) {
                $location.path('/errors/notFound');
            }
        });

    });
