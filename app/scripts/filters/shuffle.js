'use strict';

angular.module('lergoApp')
    .filter('shuffle', function ( $log ) {
        return function (array,isShuffleDisabled) {
            if ( !array || !!isShuffleDisabled || !!array.isShuffled ){ // hack to get this filter to run once.
                return array;
            }

            $log.info('shuffling');
            var m = array.length, t, i;

            // While there remain elements to shuffle
            while (m) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            array.isShuffled =true;
            return array;
        };
    });
