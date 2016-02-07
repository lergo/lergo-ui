'use strict';

/**
 *
 *
 *
 * @ngdoc directive
 * @name lergoApp.directive:lergoSameAs
 * @description
 * # lergoSameAs
 */
angular.module('lergoApp')
    .directive('lergoSameAs', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function postLink(scope, element, attrs, ctrl) {

                function validate() {
                    var viewValue = ctrl.$viewValue;
                    if (viewValue === scope.$eval(attrs.lergoSameAs)) {
                        ctrl.$setValidity('lergoSameAs', true);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('lergoSameAs', false);
                        return undefined;
                    }
                }

                scope.$watch(function () {
                    return scope.$eval(attrs.lergoSameAs);
                }, validate);

                ctrl.$parsers.unshift(validate);
            }
        };
    });
