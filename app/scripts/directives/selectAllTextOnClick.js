'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:selectAllTextOnClick
 * @description
 * # selectAllTextOnClick
 */
angular.module('lergoApp')
    .directive('selectAllTextOnClick', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element/*, attrs*/) {
                $(element).click(function () {
                    $timeout(function () {
                        element.select();
                        try {
                            if (document.execCommand('Copy')) {
                                scope.copied = true;
                                console.log('copied: ' + scope.copied);
                                $timeout(function() {scope.copied = false; console.log('slept for a while')}, 2000);

                            }
                        } catch (e) {
                        }
                    }, 0);
                });
                scope.copied = false;
            }
        };
    });
