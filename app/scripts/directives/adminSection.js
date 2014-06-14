'use strict';

angular.module('lergoApp')
    .directive('adminSection', function () {
        return {
            template: '<div ng-transclude ng-show="user.isAdmin"></div>',
            restrict: 'A',
            transclude: true,
            link: function postLink(scope, element, attrs) {

            }
        };
    });
