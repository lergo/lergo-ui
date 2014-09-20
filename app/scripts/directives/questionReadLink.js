'use strict';

angular.module('lergoApp')
    .directive('questionReadLink', function ( ) {
        return {
            template: '<a href="#!/public/questions/{{question._id}}/read"><span ng-show="hasQuestion()">{{question.question |limitTo:80 }}</span><span ng-show="!hasQuestion()">{{"questions.noTitle" | i18n }}</span></a>',
            restrict: 'A',
            scope: {
                'question': '='
            },
            link : function(scope){
                scope.hasQuestion = function(){
                    return !!scope.question.question && scope.question.question !== '';
                };
            }
        };
    });
