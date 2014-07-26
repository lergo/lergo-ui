'use strict';

/**
 *
 *  A directive that will display only if user is logged in
 *
 */
angular.module('lergoApp')
    .directive('showLoggedIn', function ($rootScope) {
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
    });
