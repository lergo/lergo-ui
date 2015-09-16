'use strict';

/**
 * @ngdoc service
 * @name lergoApp.missingTranslationFactory
 * @description
 * # missingTranslationFactory
 * Factory in the lergoApp.
 */
angular.module('lergoApp')
    .factory('missingTranslationFactory', function ($log) {

        var reported = {};

        return function (key, language) {
            var uid = key + language;
            if (!reported[uid]) { // report only once!
                if (key.indexOf('translationLanguage') < 0 && key.indexOf('general') < 0) {
                    $log.info('missing key ', key, ' from language', language);
                    reported[uid] = true;
                }
            }
            return '???' + key + '???';
        };
    });
