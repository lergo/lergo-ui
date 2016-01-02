'use strict';

angular.module('lergoApp')
    .directive('quizNextQuestionButton', function ( QuestionsService ) {
        return {
            templateUrl: 'views/directives/quizNextQuestionButton.html',
            restrict: 'A',
            link: function postLink(scope/*, element, attrs*/) {
                scope.onQuizNextQuestionButtonClick = function(){
                    if ( scope.quizItem.type === QuestionsService.QUESTION_TYPE.OPEN_QUESTION ){
                        scope.nextQuizItem();
                    }else {
                        scope.retryOrNext();
                    }
                };
            }
        };
    });
