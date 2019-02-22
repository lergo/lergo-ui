(function () {
    'use strict';

    /**
     *
     * A directive that will display content only if user is not logged in
     *
     */

    angular.module('lergoApp')
        .directive('showAnonymous', function ($rootScope) {
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
    });
})();

