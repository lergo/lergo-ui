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
                    return 'views/lessons/view/preview2/_exactMatch.html';
                };
            }
        };
    });
