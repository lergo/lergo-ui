'use strict';

angular.module('lergoApp')
    .directive('lessonTitleImage', function (LergoClient) {
        return {
            template: '<img class="img-responsive" ng-show="!!img" ng-src="{{img}}" width="100%" />' +
            '<i ng-show="!img" class="fa fa-university"></i>',
            restrict: 'A',
            scope: {
                'lesson': '='
            },
            link: function postLink(scope/*, element, attrs*/) {

                scope.$watch('lesson', function () {
                    scope.img = LergoClient.lessons.getTitleImage(scope.lesson);
                });

            }
        };
    });
