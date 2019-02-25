(function () {
    'use strict';

    /**
     * needed because autofocus only works on page load.
     * with angular, programmatic intervention required.
     */
    autofocus.$inject = ['$timeout'];
    function autofocus($timeout) {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                $timeout(function () {

                    element.focus();
                }, 1);
            }
        };
    }
    angular.module('lergoApp')
        .directive('autofocus', autofocus );
})();
