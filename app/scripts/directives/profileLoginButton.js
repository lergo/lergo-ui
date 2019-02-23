(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name lergoApp.directive:profileLoginButton
     * @description
     * # profileLoginButton
     * Used to easily navigate to all sections in the application and reduce number of clicks.
     */
    angular.module('lergoApp')
        .directive('profileLoginButton', function ( $log, LergoClient, $rootScope, $location , $timeout ) {
            return {
                templateUrl: 'views/directives/_profileLoginButton.html',
                restrict: 'A',
                scope:{
                    'user' : '=profileLoginButton'
                },
                link: function postLink(scope/*, element, attrs*/) {

                    // put on scope for tests to mock
                    scope.isMobile = function() { //  todo : make this available for everyone
                        try{ document.createEvent('TouchEvent'); return true; }
                        catch(e){ return false; }
                    };




                    scope.openMenu = function( open ){
                        scope.menuIsOpen = open;
                    };

                    scope.logout = function () {
                        LergoClient.logout().then(function () {
                            $rootScope.user = null;
                            $location.path('/');
                        });
                    };


                    scope.mouseClicked = function (e) {
                        if (scope.isMobile()) {
                            $timeout(function () {
                                scope.openMenu(true);
                            }, 0);
                            $log.info('preventing default');
                            e.preventDefault();
                        }
                    };

                }
            };
        });
})();
