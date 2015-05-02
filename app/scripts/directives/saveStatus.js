'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:saveStatus
 * @description
 * # saveStatus
 */
angular.module('lergoApp')
    .directive('saveStatus', function ( LergoTranslate ) {
        return {
            template: '<div class="lergo-h3 lergo-save-status {{getClassName()}}">{{getLabel()}}</div>',
            restrict: 'A',
            scope: {
                'data': '=saveStatus'
            },
            link: function postLink(scope/*, element, attrs*/) {
                scope.getLabel = function(){
                    if ( scope.data.saving ){
                        return LergoTranslate.translate('saving...');
                    }else if ( scope.data.saved ){
                        return LergoTranslate.translate('saved');
                    }else if ( scope.data.errorSaving ){
                        return LergoTranslate.translate('errorSaving');
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
