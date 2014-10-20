'use strict';

angular.module('lergoApp')
    .directive('quizNextQuestionButton', function () {
        return {
            templateUrl: 'views/directives/quizNextQuestionButton.html',
            restrict: 'A',
            link: function postLink(/*scope, element, attrs*/) {
            }
        };
    });
