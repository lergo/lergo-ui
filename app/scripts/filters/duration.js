'use strict';

angular.module('lergoApp').filter('duration', function( $filter ) {
	return function(duration) {

        function isNumber(prop){
            return !isNaN(parseInt(prop,10));
        }

        if ( typeof(duration) === 'object'   ){
            if ( isNumber(duration.startTime) && isNumber(duration.endTime) ){
                duration = duration.endTime - duration.startTime;
            }else{
                return $filter('translate')('report.did.not.finish');
            }
        }

        if ( !isNumber(duration) ) {
            return $filter('translate')('report.missing.info');
        }

		function pad(number) {
			return ('00' + number).slice(-2);
		}

		if (!duration) {
			return '00:00:00';
		}
        /* jshint -W052 */
        // the ~~ symbols turn floats to numbers. we had a huge duration bug because the lesson was 36 seconds.
        // but duration showed it to be 1 minutes and 36 seconds, that's because in javascript, 36/1000 = 0.6
        // and when we do Math.round(0.6) we get 1.. which is wrong. so we have to convert to int.
        // using round. see #1 description in LERGO-463
		var durationInSeconds = Math.round(duration / 1000);
		var durationInMinutes = Math.round(Math.floor(durationInSeconds / 60));
		var durationInHours = Math.round(Math.floor(durationInMinutes / 60));

		return pad(durationInHours) + ':' + pad(durationInMinutes % 60) + ':' + pad(durationInSeconds % 60);

	};
});
