'use strict';

angular.module('lergoApp').controller('LessonsInvitationsAggReportCtrl',
    function ($scope, $log, LergoClient, $routeParams, LergoTranslate, $location, $filter, $rootScope) {
        $log.info('loading');
        LergoClient.reports.getClassReportById($routeParams.reportId).then(function (result) {
            $scope.report = result.data;

            var openQueestions = _.filter($scope.report.data.quizItems, function (item) {
                return item.type === 'openQuestion';
            });
            $scope.openQuestionCount = openQueestions.length;
            $rootScope.page = {
                'title': $scope.report.data.lesson.name,
                'description': $scope.report.data.lesson.description
            };
            LergoTranslate.setLanguageByName($scope.report.data.lesson.language);
        });

        $scope.getStepAvgDuration = function (index) {
            if (!!$scope.report) {
                var stepData = $scope.report.stepDurations[index];
                if (!!stepData) {
                    return stepData.duration / stepData.count;
                }
            }
        };

        $scope.getStepCorrectPercentage = function (index) {
            if (!!$scope.report) {
                var stepData = $scope.report.stepDurations[index];
                if (!!stepData) {
                    return (stepData.correctAnswers * 100)/ stepData.totalAnswers;
                }
            }
        };
        $scope.absoluteShareLink = function (id) {
            return window.location.origin + '/#!/public/lessons/' + id + '/intro';
        };

        $scope.getStepViewByType = function (step) {
            return '/views/lessons/invitations/report/steps/_' + step.type + '.html';
        };

        $scope.redirectToIndividualReports = function () {
            $location.path('/user/create/reports').search({
                reportType: 'students',
                'lergoFilter.reportClass': $scope.report.data.invitee.class,
                'lergoFilter.reportLesson': JSON.stringify({
                    _id: $scope.report.data.lesson._id,
                    name: $scope.report.data.lesson.name
                })
            });
        };
        $window.scrollTo(0, 0);
    });
