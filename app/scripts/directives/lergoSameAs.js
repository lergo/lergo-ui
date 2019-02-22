(function () {
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

                    function getTarget(){ // it is unclear if target should be form field or ng-model on scope.. simply support both
                        var target = scope.$eval(attrs.lergoSameAs);
                        if ( target && target.$viewValue ){
                            return target.$viewValue;
                        }
                        return target;
                    }

                    function validate() {
                        var viewValue = ctrl.$viewValue;
                        if (viewValue === getTarget()) {
                            ctrl.$setValidity('lergoSameAs', true);
                            return viewValue;
                        } else {
                            ctrl.$setValidity('lergoSameAs', false);
                            return undefined;
                        }
                    }

                    scope.$watch(function () {
                        return getTarget();
                    }, validate);

                    // this is ugly
                    element.on('blur', validate); // always validate on blur as well.. because angular has a bug that won't revalidate if value between 2 blurs remained the same.

                    ctrl.$parsers.unshift(validate);
                }
            };
    });
})();
