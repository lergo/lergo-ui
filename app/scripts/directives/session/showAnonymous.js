(function () {
    'use strict';

    /**
     *
     * A directive that will display content only if user is not logged in
     *
     */
    showAnonymous.$inject = ['$rootScope'];
    function showAnonymous($rootScope) {
        return {
            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {

                $rootScope.$watch('user', function () {
                    if (!!$rootScope.user) {
                        $(element).hide();
                    } else {
                        $(element).show();
                    }
                });
            }
        };
    }
    angular.module('lergoApp')
        .directive('showAnonymous', showAnonymous);
})();

