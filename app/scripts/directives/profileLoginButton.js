'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:profileLoginButton
 * @description
 * # profileLoginButton
 * Used to easily navigate to all sections in the application and reduce number of clicks.
 */
angular.module('lergoApp')
    .directive('profileLoginButton', function ( $log, LergoClient, $rootScope, $location ) {
        return {
            templateUrl: 'views/directives/_profileLoginButton.html',
            restrict: 'A',
            scope:{
                'user' : '=profileLoginButton'
            },
            link: function postLink(scope/*, element, attrs*/) {
                scope.openMenu = function( open ){
                    $log.info('I am opening the menu', typeof(open));
                    scope.menuIsOpen = open;
                }

                scope.logout = function () {
                    LergoClient.logout().then(function () {
                        $rootScope.user = null;
                        $location.path('/');
                    });
                };

            }
        };
    });
