'use strict';

/**
 * @ngdoc directive
 * @name lergoApp.directive:clearErrors
 * @description
 * # clearErrors
 *
 *
 *
 */
angular.module('lergoApp')
    .directive('clearErrors', function ($timeout) {
        return {
            restrict: 'A',
            require: '^form',
            link: function postLink(scope, element, attrs, ctrl) {

                var clearFields = ( attrs.clearErrors ? attrs.clearErrors : attrs.name ).split(' ');

                var oldValue = null;

                function onChange( ){
                    _.each(clearFields, function( field ){
                        clearErrorsOnField(field);
                    });
                }

                function clearErrorsOnField(fieldName) {
                    var field = ctrl[fieldName];
                    _.each(field.$error, function (value, key) {
                        if (value) {
                            field.$setValidity(key, true);
                        }
                    });
                }

                element.on('keydown', function(){
                    $timeout(function(){
                        var newValue = element.val(); // implement your own $watch as the whole idea is to update the errors outside the ngModel update loop
                        if ( newValue !== oldValue ){
                            onChange(newValue, oldValue );
                            oldValue = newValue;
                        }
                    },0);
                });

            }
        };
    });
