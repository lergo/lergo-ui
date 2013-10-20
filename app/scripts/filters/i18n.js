'use strict';

angular.module('lergoApp')
    .filter('i18n', function (LergoTranslate) {
        return function (input, opts ) {
            console.log(opts);
            if ( opts.skip ){
                return input;
            }else{
                return LergoTranslate.translate( input);
            }

        };
    });
