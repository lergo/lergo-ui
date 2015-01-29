'use strict';

angular.module('lergoApp')
    .directive('lessonIntroLink', function () {
        return {
            template: '<a ng-href="#!/public/lessons/{{lesson._id}}/intro" ng-transclude></a>',
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: {
                'lesson': '='
            },
            link: function postLink(/*scope, element, attrs*/) {

            }
        };
    });
