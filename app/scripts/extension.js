(function () {
    /**
     * @module extensions
     * @description
     * this file contains extensions for 3rd parties like angular and lodash
     * **/


    'use strict';

    /**
     * @description
     * checks if a variable is defined and not null
     * @param value
     * @returns {boolean} true iff value is defined and not null.
     */
    _.isDefined = function(value){
        return value !== null && typeof(value) !== 'undefined';
    };

    /**
     * @description
     * checks if value is defined and not null
     * @param value
     * @returns {boolean} true iff value is defined and not null.
     */
    angular.isDefined = function(value){
        return _.isDefined(value);
    };

    /**
     * @description
     * compares shuffled to orig, and decides whether or not shuffled is a shuffled version of orig
     * @param orig an array
     * @param shuffled an array that might be a shuffled version of orig
     * @returns {boolean} iff shuffled is a shuffled version of orig
     */
    _.isShuffled = function( orig, shuffled ){
        if ( !orig || !shuffled ){
            return false;
        }

        if ( !orig.length || !shuffled.length ){ // yes, treat 0 as well..
            return false;
        }

        if (_.xor(shuffled, orig).length !== 0 ){ // finds elements that exist in one array but not the other.
            return false; // it is not a shuffle of orig, it is a different array altogether.
        }

        // find index that does not contains same element in both arrays.
        var mismatch = _.find(shuffled, function(value,index){
                return orig[index] !== value ;
            }
        );

        return !!mismatch;
    };
})();
