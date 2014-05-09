'use strict';

angular.module('lergoApp')
    .directive('baseLayout', function ( $rootScope, $log, $location, LergoClient, LergoTranslate ) {
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

                $rootScope.lergoLanguages = [{'id': 'en', 'label':'English'}, {'id' : 'he', 'label' : 'Hebrew'}];

                $rootScope.$watch('lergoLanguage', function(newValue, oldValue){
                    $log.info('new language',newValue);
                    LergoTranslate.setLanguage( newValue );
                });


                scope.logout = function(){
                    LergoClient.logout().then(function(){
                        $rootScope.user = null;
                        $location.path('/');
                    });
                };
            }
        };
    });
