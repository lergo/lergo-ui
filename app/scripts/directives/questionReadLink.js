'use strict';

angular.module('lergoApp')
    .directive('questionReadLink', function () {
        return {
            template: '<a href="#!/public/questions/{{question._id}}/read">{{question.question |limitTo:80 }}</a>',
            restrict: 'A',
            scope: {
                'question': '='
            }
        };
    });
