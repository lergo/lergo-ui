'use strict';

angular.module('lergoApp').filter('duration', function() {
	return function(duration) {

        function isNumber(prop){
            return !isNaN(parseInt(prop,10));
        }

        if ( typeof(duration) === 'object'   ){
            if ( isNumber(duration.startTime) && isNumber(duration.endTime) ){
                duration = duration.endTime - duration.startTime;
            }else{

                return 'did not finish';
            }
        }

        if ( !isNumber(duration) ) {
            return 'missing info';
        }

		function pad(number) {
			return ('00' + number).slice(-2);
		}

		if (!duration) {
			return '00:00:00';
		}
        // using round. see #1 description in LERGO-463
		var durationInSeconds = Math.round(duration / 1000);
		var durationInMinutes = Math.round(durationInSeconds / 60);
		var durationInHours = Math.round(durationInMinutes / 60);

		return pad(durationInHours) + ':' + pad(durationInMinutes % 60) + ':' + pad(durationInSeconds % 60);

	};
});
