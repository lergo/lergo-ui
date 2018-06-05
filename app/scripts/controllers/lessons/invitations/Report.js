'use strict';

angular.module('lergoApp').controller('LessonsInvitationsReportCtrl',
    function ($scope, $log, LergoClient, $routeParams, LergoTranslate, $location, $filter, $rootScope) {
        $log.info('loading');
        LergoClient.reports.getById($routeParams.reportId).then(function (result) {
            $scope.report = result.data;
            getWrongQuestion($scope.report);
            $rootScope.page = {
                'title': $scope.report.data.lesson.name,
                'description': $scope.report.data.lesson.description
            };
            LergoTranslate.setLanguageByName($scope.report.data.lesson.language);
        });
        $scope.stats = [];
        $scope.reportStats = {};
        $scope.$on('stats', function (event, data) {
            $scope.stats[data.index] = data;
            $scope.reportStats.correct = _.sumBy($scope.stats, 'ucq');
            $scope.reportStats.wrong = _.sumBy($scope.stats, 'uwq');
            $scope.reportStats.openQuestions = _.sumBy($scope.stats, 'openQuestions');
        });

        $scope.absoluteShareLink = function (id) {
            return window.location.origin + '/#!/public/lessons/' + id + '/intro';
        };

        $scope.startLesson = function (lessonId) {
            $scope.startBtnDisable=true;
            if (!lessonId) {
                redirectToInvitation($scope.report.data.lesson._id, $scope.report.invitationId);
            } else {
                LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function (result) {
                    redirectToInvitation(lessonId, result.data._id);
                });
            }
        };
        function redirectToInvitation(lessonId, invId) {
            // in case of temporary lesson we don't want to remember history
            if (!$scope.report.data.lesson.temporary) {
                $location.path('/public/lessons/invitations/' + invId + '/display').search({
                    lessonId: lessonId
                });
            } else {
                $location.path('/public/lessons/invitations/' + invId + '/display').search({
                    lessonId: lessonId
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
                    $location.path('/public/lessons/reports/agg/' + reportId + '/display');
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
            return !!$scope.wrongQuestions && $scope.wrongQuestions.length > 0 && $scope.isCompleted($scope.report);
        };

        $scope.showContinueLesson = function () {
            return !$scope.isCompleted($scope.report);
        };

        $scope.continueLessonUrl = function () {
            return LergoClient.reports.continueLessonUrl($scope.report);
        };

        $scope.practiceMistakes = function () {
            $scope.practiseBtnDisable = true;
            LergoClient.lessons.createLessonFromWrongQuestions($scope.report, $scope.wrongQuestions).then(
                function (lesson) {
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
    })
;
