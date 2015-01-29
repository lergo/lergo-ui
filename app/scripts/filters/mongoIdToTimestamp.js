'use strict';

angular.module('lergoApp')
    .filter('mongoIdToTimestamp', function () {
        return function (input) {
            var obj = null;
            if (!input) {
                return '';
            }
            if (input.hasOwnProperty('_idTimestamp')) {
                return input._idTimestamp;
            }
            if (input.hasOwnProperty('_id')) {
                obj = input;
                input = input._id;
            }


            // first 4 bytes are the timestamp portion (8 hex chars)
            var timehex = input.substring(0, 8);

            // convert to a number... base 16
            var secondsSinceEpoch = parseInt(timehex, 16);


            // convert to milliseconds, and create a new date
            var dt = secondsSinceEpoch * 1000;

            if (obj !== null) {
                obj._idTimestamp = dt;
            }

            return dt;

        };
    });
