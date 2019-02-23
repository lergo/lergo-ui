(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name lergoApp.directive:saveStatus
     * @description
     * # saveStatus
     */
    angular.module('lergoApp')
        .directive('saveStatus', function ( $filter ) {
            return {
                template: '<div class="lergo-h3 lergo-save-status {{getClassName()}}">{{getLabel()}}</div>',
                restrict: 'A',
                scope: {
                    'data': '=saveStatus'
                },
                link: function postLink(scope/*, element, attrs*/) {
                    var translateFilter = $filter('translate');
                    scope.getLabel = function(){
                        if ( scope.data.saving ){
                            return translateFilter('saving');
                        }else if ( scope.data.saved ){
                            return translateFilter('saved');
                        }else if ( scope.data.errorSaving ){
                            return translateFilter('errorSaving');
                        }
                    };

                    scope.getClassName = function(){
                        if ( scope.data.saving ){
                            return 'lergo-saving-in-progress';
                        }else if ( scope.data.saved ){
                            return 'lergo-saving-saved';
                        }else if ( scope.data.errorSaving ){
                            return 'lergo-saving-error';
                        }
                    };
                }
            };
        });
})();
