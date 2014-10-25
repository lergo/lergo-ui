'use strict';

angular.module('lergoApp')
    .directive('lergoLanguageDirectionClass', function ($rootScope, $filter) {
        return {
            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {

                scope.$watch(function () {
                        return $rootScope.lergoLanguage;
                    },
                    function (newValue, oldValue) {
                        try {
                            var oldDirection = $filter('i18nDirection')(oldValue);
                            element.removeClass(oldDirection);
                        } catch (e) {
                        }

                        try {
                            var newDirection = $filter('i18nDirection')(newValue);
                            element.addClass(newDirection);
                        } catch (e) {
                        }
                    }
                );
            }
        };
    });
