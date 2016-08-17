'use strict';

angular.module('lergoApp').directive('aggReportView', function ($log, LergoClient) {
    return {
        templateUrl: 'views/directives/_aggReportView.html',
        restrict: 'E',
        scope: {
            'answers': '=',
            'quizItems': '='
        },
        link: function ($scope/* , element, attrs */) {
            $scope.getQuizItemTemplate = function (type) {
                return LergoClient.questions.getTypeById(type).aggReportTemplate;
            };

            $scope.getDuration = function (quizItem) {
                var stats = $scope.answers[quizItem._id];
                if (!!stats) {
                    quizItem.duration = stats.duration / stats.count;
                    return quizItem.duration;
                }
            };
        }
    };
});
