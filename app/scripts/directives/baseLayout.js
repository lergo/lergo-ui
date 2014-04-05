'use strict';

angular.module('lergoApp')
    .directive('baseLayout', function ( $rootScope, $location, LergoClient ) {
        return {
            templateUrl: '/views/baseLayout.html',
            transclude: true,
            restrict: 'C',
            replace: true,
            link: function postLink(scope/*, element /*, attrs*/) {
                LergoClient.isLoggedIn().then(
                    function ( result ) {
                        if ( !!result ){
                            $rootScope.user = result.data;
                        }
                    }
                );

                scope.logout = function(){
                    LergoClient.logout().then(function(){
                        $rootScope.user = null;
                        $location.path('/');
                    });
                }
            }
        };
    });
