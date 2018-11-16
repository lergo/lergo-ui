/**
 * Created by rahul on 5/9/16.
 */
'use strict';


angular.module('lergoApp')
    .directive('lessonPreview',function (QuestionsService) {
        return {
            templateUrl: 'views/lessons/view/preview2/preview.html',
            restrict: 'E',
            transclude: true,
            scope: {
                'quizItem': '='
            },
            link: function ($scope) {

                $scope.getLessonTemplate = function () {
                    return 'views/questions/view/preview2/_' + $scope.quizItem.type + '.html';
                    /*return 'views/lessons/view/preview2/_showLessons.html';*/
                };

                $scope.isFillInTheBlanks = function () {
                    return questionsService.lesson_TYPE.FILL_IN_THE_BLANKS === $scope.quizItem.type;
                };
            }
        };
    });

