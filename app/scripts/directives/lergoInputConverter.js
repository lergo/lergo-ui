'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:lergoInputConverter
 * @description
 * # lergoInputConverter
 */
angular.module('lergoApp')
    .directive('lergoInputConverter', function (LergoResourceLinksConverter) {
        return {
            template: '<div></div>',
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModel) {

                scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newValue) {

                    var converted = LergoResourceLinksConverter.convert(newValue);
                    if (converted !== newValue) {
                        ngModel.$setViewValue(converted);
                        ngModel.$commitViewValue();
                        ngModel.$render();
                    }
                });
            }
        };
    });
