 (function(){
    'use strict';

    angular.module('lergoApp').directive('aggReportView', function ($log, LergoClient) {
        return {
            templateUrl: 'aggReportView/_aggReportView.html',
            restrict: 'E',
            scope: {
                'answers': '=',
                'quizItems': '='
            },
            link: function ($scope/* , element, attrs */) {
                $scope.getQuizItemTemplate = function (type) {
                    return LergoClient.questions.getTypeById(type).aggReportTemplate;
                };

                $scope.updateStats = function (quizItem) {
                    var stats = $scope.answers[quizItem._id];

                    if (!!stats) {
                        stats.avgDuration = stats.duration / stats.count;
                        if (quizItem.type !== LergoClient.questions.QUESTION_TYPE.OPEN_QUESTION) {
                            stats.avgCorrectPercentage = (stats.correct * 100) / stats.count;
                        }
                        quizItem.stats = stats;
                    }
                };
            }
        };
    });
 })();