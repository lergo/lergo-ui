'use strict';

angular.module('lergoApp')
    .filter('i18nDirection', function (LergoTranslate) {
        return function (input) {
            return LergoTranslate.getLanguageObj(input).dir;
        };
    });
