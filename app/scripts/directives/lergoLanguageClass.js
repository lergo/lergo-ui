'use strict';

angular.module('lergoApp')
    .directive('lergoLanguageClass', function ($rootScope) {
        return {

            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {

                scope.$watch(function () {
                    return $rootScope.lergoLanguage;
                }, function (newValue, oldValue) {
                    try {
                        element.removeClass(oldValue);
                    } catch (e) {
                    }
                    try {
                        element.addClass(newValue);
                    } catch (e) {
                    }
                });
            }
        };
    });
