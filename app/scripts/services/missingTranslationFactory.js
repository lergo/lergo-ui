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
    return function(key, language){
        if ( key.indexOf('translationLanguage') < 0 && key.indexOf('general') < 0){
            $log.info('missing key ', key , ' from language', language);
        }
        return '???' + key + '???';
    }
  });
