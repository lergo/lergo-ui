(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name lergoApp.directive:onEnter
     * @description
     * # onEnter
     */
    angular.module('lergoApp')
        .directive('onEnter', function ($parse, $timeout) {
            return {
                restrict: 'A',
                link: function postLink(scope, element, attrs) {
                    $(element).keypress(function (event) {
                        try {
                            if (event.keyCode === 13) {
                                $timeout(function () {
                                    $parse(attrs.onEnter)(scope, {$event: event});
                                }, 0);
                            }
                        } catch (e) {
                        }

                    });
                }
            };
    });
})();
