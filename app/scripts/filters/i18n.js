'use strict';

angular.module('lergoApp')
    .filter('i18n', function (LergoTranslate) {
        return function (input, opts ) {

            if ( !!opts && !!opts.skip ){
                return input;
            }else{
                return LergoTranslate.translate( input);
            }

        };
    });
