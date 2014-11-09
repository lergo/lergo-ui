'use strict';

angular.module('lergoApp')
    .filter('i18n', function (LergoTranslate) {

        function translate(input, opts ) {
            if ( !!opts && !!opts.skip ){
                return input;
            }else{
                return LergoTranslate.translate( input);
            }
        }

        translate.$stateful = true;
        return translate;
    });
