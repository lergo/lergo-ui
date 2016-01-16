'use strict';

angular.module('lergoApp')
    .directive('lergoLanguageDirectionClass', function (LergoTranslate, $filter) {
        return {
            restrict: 'A',
            link: function postLink(scope, element/*, attrs*/) {

                scope.$watch(function () {
                        return LergoTranslate.getLanguage();
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
