'use strict';

angular.module('lergoApp').controller('LessonsInvitationsDisplayCtrl',
    function ($window, $scope, $filter, LergoClient, QuestionsService, LessonsService, LergoTranslate, $location, $routeParams, $log, $controller, ContinuousSaveReports, $rootScope, ShareService, localStorageService) {
        $window.scrollTo(0, 0);
        $log.info('loading invitation');
        var errorWhileSaving = false;
        $scope.shareSection = 'link';
        var updateChange = new ContinuousSaveReports({
            'saveFn': function (value) {
               /* window.scrollTo(0, 68);*/
                $log.info('updating report');
                var inviteeName =  ShareService.getInvitee();
                if (inviteeName) {
                    value.inviteeOverride = { name: inviteeName };
                }
               
                var finished = value.finished; // value.data is the invitation. we
                // want the report.

                if (finished) {
                    getWrongQuestion(value);
                }

                return LergoClient.reports.update(value).then(function (result) {
                   
                    result.data.data.invitee = result.data.invitee;
                    if (finished) {
                        if (errorWhileSaving) {
                            toastr.success($filter('translate')('report.saved.successfully'));
                        }
                        errorWhileSaving = false;
                        if (!$scope.invitation.anonymous && !!$scope.invitation.emailNotification) {
                            LergoClient.reports.ready($routeParams.reportId);
                        } else {
                            $log.info('not sending report link because anonymous');
                        }
                    }
                    return result;
                }, function (result) {
                    if (finished) {
                        errorWhileSaving = true;
                        toastr.error($filter('translate')('report.error.while.updating'));
                        $log.error('error while updating report', result.data);
                    }
                    return result;
                });

            }
        });

        $scope.isValid = function(quizItem) {
            if (!quizItem || !quizItem.type) {
                return false;
            }
            return QuestionsService.getTypeById(quizItem.type).isValid(quizItem);
        };

        function initializeReport(invitation) {
            /**  
             *   prior to creating a new report and starting a lesson, check that the lesson is valid 
             *   first check if each quiz item is valid - if not, remove from local lesson and lesson in dB and questionId in dB
             *   then check that each step is valid - remove locally and on dB
            */
            var steps = invitation.lesson.steps;
            var quizItems = invitation.quizItems;
            for (var k = quizItems.length -1; k >= 0; k--) {
                if ($scope.isValid(quizItems[k])) {
                    $log.debug('valid quizItem');
                } else {
                    var illegalId = quizItems[k]._id;
                    quizItems.splice(quizItems.indexOf(illegalId), 1);
                    for (var i = steps.length -1; i >= 0; i--) {
                        if (steps[i].quizItems) {
                            for (var j = steps[i].quizItems.length -1; j >= 0; j--) {
                                var questionId = steps[i].quizItems[j];
                                if (questionId === illegalId){
                                    steps[i].quizItems.splice(steps[i].quizItems.indexOf(illegalId), 1);
                                    $log.info('fixing lesson locally');
                                    $log.info('updating fixed lesson on Db');
                                    LergoClient.lessons.fix(invitation.lesson);
                                    $log.info('deleting invalid question on Db');
                                    QuestionsService.removeQuestion(questionId);
                                }
                            }
                        }
                    }
                }
            }
           
            for (var l = steps.length -1; l >= 0; l--) {
                if (!LessonsService.checkIfStepIsValid(steps[l])) {
                    $log.info('deleting invalid step locally ',l);
                    steps.splice(l, 1);
                    $log.info('removing step on Db');
                    LergoClient.lessons.fix(invitation.lesson);
                }
            }
           
            // broadcast start of lesson
            function initializeReportWriter(report) {
                $scope.report = report;
                $scope.$watch('report', updateChange.onValueChange, true);
                $controller('LessonsReportWriteCtrl', {
                    $scope: $scope
                });

                $controller('LessonsDisplayCtrl', {
                    $scope: $scope
                }); // display should be initialized here, we should not show lesson
                // before we can report.
                $rootScope.$broadcast('startLesson', invitation);
            }

            var reportId = $routeParams.reportId;
            if (!!reportId) {
                LergoClient.reports.getById(reportId).then(function (result) {

                    initializeReportWriter(result.data);
                });
            } else {
                LergoClient.reports.createFromInvitation(invitation).then(function (result) {
                    $location.search('reportId', result.data._id).replace();
                    initializeReportWriter(result.data);
                });
            }
        }

        // todo : do a test for invitation.finished = true
        $scope.$watch(function () { // broadcast end of lesson if not next step
            return !!$scope.invitation && !!$scope.hasNextStep && !$scope.hasNextStep();
        }, function (newValue/* , oldValue */) {
            if (!!newValue) {
                // just notify end lesson. do nothing else. wait for report to
                // update.
                $rootScope.$broadcast('endLesson');
                if (!!$scope.invitation && !$scope.invitation.lesson.temporary) {
                    $scope.invitation.finished = true;
                    LergoClient.lessonsInvitations.update($scope.invitation);
                }
            }
        });

        // todo: technically we don't need to build lesson invitation anymore..
        // todo: we should build the report instead since all data is on the report and display the data from there.
        // todo: the display will still be for lesson invitation, but the data should come from report. (this resolves ambiguity regarding display for report.. there's only one).
        LergoClient.lessonsInvitations.build($routeParams.invitationId, true, false).then(function (result) {
            $scope.invitation = result.data;
            $scope.lesson = result.data.lesson;
            $scope.lesson.image = LergoClient.lessons.getTitleImage($scope.lesson);
            $scope.questions = {};

            $scope.shareLink = LergoClient.lessons.getShareLink($scope.lesson);
            $scope.embedCode = '<iframe src="' + $scope.shareLink + '" height="900" width="600" frameBorder="0"></iframe>';

            initializeReport($scope.invitation);
            var items = result.data.quizItems;
            if (!items) {
                return;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                $scope.questions[item._id] = item;

            }
        }, function (result) {
            if (result.status) { // lesson invitation might not be found if was temporary. temporary lessons are deleted on finish. (@see Write.js 'endLesson' event)
               // incase the invitation is deleted and user tries to "start over" or "continue lesson"
                // we should insert anonymous invitation
                if (!!$routeParams.lessonId) {
                    LergoClient.lessonsInvitations.createAnonymous($routeParams.lessonId).then(function (result) {
                        var invitation = result.data;
                        $location.path('/public/lessons/invitations/' + invitation._id + '/display');
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

        $scope.startLesson = function (lessonId) {
            if (!lessonId) {
                redirectToInvitation($scope.lesson._id, $scope.invitation._id);
            } else {
                LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function (result) {
                    redirectToInvitation(lessonId, result.data._id);
                });
            }
        };
        function redirectToInvitation(lessonId, invId) {
            // in case of temporary lesson we don't want to remember history
            if (!$scope.lesson.temporary) {
                $location.path('/public/lessons/' + lessonId + '/intro').search({
                    invitationId: invId,
                    autoPlay: true
                });
            } else {
                $location.path('/public/lessons/' + lessonId + '/intro').search({
                    invitationId: invId,
                    autoPlay: true
                }).replace();
            }
        }


        var lessonLikeWatch = null;
        $scope.$watch('lesson', function (newValue) {
            if (!!newValue) {
                // get my like - will decide if I like this lesson or not
                LergoClient.likes.getMyLessonLike($scope.lesson).then(function (result) {
                    $scope.lessonLike = result.data;
                });

                if (lessonLikeWatch === null) {
                    lessonLikeWatch = $scope.$watch('lessonLike', function () {
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

        $scope.practiceMistakes = function () {
            $scope.practiseBtnDisable = true;
            LergoClient.lessons.createLessonFromWrongQuestions($scope.report, $scope.wrongQuestions).then(
                function (lesson) {
                    $log.info('Starting practice mistakes');
                    $scope.startLesson(lesson._id);
                    $scope.practiseBtnDisable = false;
                }, function () {
                    $log.error('Error in creating Practise Lesson');
                    $scope.practiseBtnDisable = false;
                });
        };
        function getWrongQuestion(report) {
            $scope.wrongQuestions = [];
            angular.forEach(report.answers, function (answer) {
                if (!answer.checkAnswer.correct) {
                    $scope.wrongQuestions.push(answer.quizItemId);
                }
            });
        }

        $scope.practiceMistakesAnon = function () {
            $scope.practiseBtnDisable = true;
            LergoClient.lessons.createLessonFromWrongQuestionsForAnon($scope.report, $scope.wrongQuestions).then(
                function (lesson) {
                    $log.info('Starting practice mistakes for Anon');
                    $scope.startLesson(lesson._id);
                    $scope.practiseBtnDisable = false;
                }, function () {
                    $log.error('Error in creating Practise Lesson');
                    $scope.practiseBtnDisable = false;
                });
        };

        $scope.showReport = function () {
            // in case of temporary lesson we don't want to remember history
            if (!$scope.lesson.temporary) {
                $location.path('/public/lessons/reports/' + $scope.report._id + '/display');
            } else {
                $location.path('/public/lessons/reports/' + $scope.report._id + '/display').replace();
            }
        };

        $scope.isPlaylist = function() {
            if (localStorageService.get('playlistUrl')) {
                return true;
            } else {
                return false;
            }
        };
        $scope.backToPlaylist = function() {
            var url = localStorageService.get('playlistUrl');
            localStorageService.remove('playlistUrl');
            $location.path(url);
        };
    });
