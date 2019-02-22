(function () {
    'use strict';

    angular.module('lergoApp')
        .directive('lergoLanguageClass', function (LergoTranslate) {
            return {

                restrict: 'A',
                link: function postLink(scope, element/*, attrs*/) {

                    scope.$watch(function () {
                        return LergoTranslate.getLanguage();
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
})();
