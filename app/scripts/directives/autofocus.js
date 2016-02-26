'use strict';

/**
 * needed because autofocus only works on page load.
 * with angular, programmatic intervention required.
 */
angular.module('lergoApp')
    .directive('autofocus', function ($timeout) {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                $timeout(function () {

                    element.focus();
                }, 1);
            }
        };
    });
