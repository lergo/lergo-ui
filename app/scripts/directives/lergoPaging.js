'use strict';

angular.module('lergoApp')
    .directive('lergoPaging', function () {
        return {
            templateUrl: 'views/directives/_lergoPaging.html',
            restrict: 'A',
            'scope': {
                'page' : '=',
                'change' : '&onChange'
            },
            link: function postLink(scope/*, element, attrs*/) {
                _.merge(scope.page,{ 'size' : conf.filtering.defaultPageSize, 'current' : 1, 'count' : 0 });
                scope.$watch( 'page.current', scope.change, true);
            }
        };
    });
