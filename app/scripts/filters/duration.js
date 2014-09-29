'use strict';

angular.module('lergoApp').filter('duration', function() {
	return function(duration) {

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
