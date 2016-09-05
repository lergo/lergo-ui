/**
 * Created by rahul on 5/9/16.
 */
'use strict';


angular.module('lergoApp')
    .directive('questionPreview', function () {
        return {
            templateUrl: 'views/questions/view/preview2/preview.html',
            restrict: 'E',
            transclude: true,
            scope: {
                'quizItem': '='
            },
            link: function ($scope) {

                $scope.getQuestionTemplate = function () {
                    return 'views/questions/view/preview2/_' + $scope.quizItem.type + '.html';
                };
            }
        };
    });
