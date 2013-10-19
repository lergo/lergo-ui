'use strict';

angular.module('lergoApp')
    .filter('i18n', function (LergoTranslate) {
        return function (input) {
            return LergoTranslate.translate( input);
        };
    });
