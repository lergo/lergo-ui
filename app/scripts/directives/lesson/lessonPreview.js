/**
 * Created by rahul on 5/9/16.
 */
'use strict';


angular.module('lergoApp')
    .directive('lessonPreview', function (LessonsService) {
        return {
            templateUrl: 'views/lessons/view/preview2/preview.html',
            restrict: 'E',
            transclude: true,
            scope: {
                'quizItem': '='
            },
            link: function ($scope) {

                $scope.getLessonTemplate = function () {
                    console.log('--------------------------------the $scope.quizItem.type is ',$scope.quizItem);
                    return 'views/lessons/view/preview2/_exactMatch.html';
                };

                // $scope.isFillInTheBlanks = function () {
                //     return LessonsService.QUESTION_TYPE.FILL_IN_THE_BLANKS === $scope.quizItem.type;
                // };
            }
        };
    });
