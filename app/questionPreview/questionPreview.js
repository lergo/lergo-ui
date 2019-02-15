/**
 * Created by rahul on 5/9/16.
 */
'use strict';


angular.module('lergoApp')
    .directive('questionPreview', function (QuestionsService) {
        return {
            templateUrl: 'questionPreviw/preview2/preview.html',
            restrict: 'E',
            transclude: true,
            scope: {
                'quizItem': '='
            },
            link: function ($scope) {

                $scope.getQuestionTemplate = function () {
                    return 'questionPreviw/preview2/_' + $scope.quizItem.type + '.html';
                };

                $scope.isFillInTheBlanks = function () {
                    return QuestionsService.QUESTION_TYPE.FILL_IN_THE_BLANKS === $scope.quizItem.type;
                };
            }
        };
    });