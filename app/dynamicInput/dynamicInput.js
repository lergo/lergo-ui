/**
 * Created by rahul on 18/12/16.
 */
'use strict';


var dynamicInput = function () {
    return {
        templateUrl: 'dynamicInput/_dynamicInput.html',
        restrict: 'E',
        scope: {
            'quiz': '=',
            'index': '='
        },
        link: function postLink(scope/*, element, attrs*/) {
            var quizItem = scope.quiz;
            var index = scope.index;

            scope.getFillIntheBlankSize = function() {
                if (!quizItem.blanks || !quizItem.blanks.type || quizItem.blanks.type === 'auto') {
                    if (!!quizItem.answer[index]) {
                        var answer = quizItem.answer[index].split(';');
                        var maxLength = 0;
                        for (var i = 0; i < answer.length; i++) {
                            if (answer[i].length > maxLength) {
                                maxLength = answer[i].length;
                            }
                        }
                        return maxLength * 10 + 20;
                    }
                } else if (quizItem.blanks.type === 'custom') {
                    quizItem.blanks.size = !!quizItem.blanks.size ? quizItem.blanks.size : 4;
                    return quizItem.blanks.size * 10 + 20;

                }
            };
        }
    };
};
angular.module('lergoApp').directive('dynamicInput',dynamicInput);
