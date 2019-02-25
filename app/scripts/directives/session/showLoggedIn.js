(function () {
    'use strict';

    /**
     *
     *  A directive that will display only if user is logged in
     *
     */
    showLoggedIn.$inject = ['$rootScope'];
    function showLoggedIn($rootScope) {
        return {
            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {
                $rootScope.$watch('user', function () {
                    if (!$rootScope.user) {
                        $(element).hide();
                    } else {
                        $(element).show();
                    }
                });
            }
        };
    }
    angular.module('lergoApp')
        .directive('showLoggedIn', showLoggedIn);
})();
