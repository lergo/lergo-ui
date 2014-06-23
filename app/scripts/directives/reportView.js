'use strict';

angular.module('lergoApp')
    .directive('lessonView', function ($log, LergoClient) {
        return {
            templateUrl: '/views/lessons/invitations/report/_display.html',
            restrict: 'A',
            scope: {
                'lesson': '=',
                'answers': '=',
                'quizItems': '='
            },
            link: function ($scope/*, element, attrs*/) {


                $log.info('showing lesson report');


                function getAnswer(quizItemId, index) {
                    for (var i = 0; i < $scope.answers.length; i++) {
                        var answer = $scope.answers[i];
                        if (( answer.quizItemId === quizItemId ) && ( answer.stepIndex === index )) {
                            return answer;
                        }
                    }
                    return null;
                }

                function getQuizItem(quizItemId) {
                    for (var i = 0; i < $scope.quizItems.length; i++) {
                        if ($scope.quizItems[i]._id === quizItemId) {
                            return $scope.quizItems[i];
                        }
                    }
                    return null;
                }


                $scope.getQuizItemTemplate = function (type) {
                    return LergoClient.questions.getTypeById(type).reportTemplate;
                };


                /////////////////    construct a single object with question, user answer and answer check

                var reportQuizItems = {}; // cache

                $scope.getReportQuizItems = function (step, index) {

                    if (reportQuizItems.hasOwnProperty('' + index)) {
                        return reportQuizItems['' + index];
                    }

                    var results = [];


                    var quizItemsIds = $scope.lesson.steps[index].quizItems;

                    $log.info('getting report quiz Items', step);

                    for (var i = 0; i < quizItemsIds.length; i++) {
                        var qiId = quizItemsIds[i];


                        var answer = getAnswer(qiId, index);
                        var qi = getQuizItem(qiId);

                        results.push(_.merge({}, qi, answer));


                    }
                    $log.info('quizItems', results);
                    reportQuizItems['' + index] = results;
                    return results;
                };

                $scope.getStepViewByType = function (step) {
                    var result = '/views/lessons/invitations/report/steps/_' + step.type + '.html';
                    $log.info('result', result);
                    return  result;
                };
            }

        };
    });
