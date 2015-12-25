'use strict';

/**
* @ngdoc directive
* @name lergoApp.directive:filterIsActive
* @description
* # filterIsActive
*/
angular.module('lergoApp')
    .directive('filterIsActive', function (LergoFilterService, localStorageService) {
        return {
            templateUrl: 'views/directives/_filterIsActive.html',
            restrict: 'C',
            scope:{
                relevancyOpts: '=filterIsActive'
            },
            link: function postLink(scope, element) {

                element.hide(); // default to hide
                scope.$watch(
                    function(){
                        LergoFilterService.isActive(LergoFilterService.RESET_TYPES.LOGO, scope.relevancyOpts);
                    },
                    function(newValue){
                        scope.isActive = newValue;
                    }
                );

                var OFF_FLAG='filterActiveNotification';
                function isOff(){
                    if ( localStorageService.get(OFF_FLAG) === 'off'){
                        element.hide();
                    }else{
                        element.show();
                    }
                }
                isOff();

                scope.hideNotification = function(){
                    localStorageService.set(OFF_FLAG, 'off');
                    isOff();
                };

                scope.resetFilter = function(){
                    LergoFilterService.resetFilter(LergoFilterService.RESET_TYPES.LOGO);
                };
            }
        };
    });
