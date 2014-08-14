'use strict';

angular.module('lergoApp').filter('duration', function() {
	return function(duration) {

		function pad(number) {
			return ('00' + number).slice(-2);
		}

		if (!duration) {
			return '00:00:00';
		}
		var durationInSeconds = Math.floor(duration / 1000);
		var durationInMinutes = Math.floor(durationInSeconds / 60);
		var durationInHours = Math.floor(durationInMinutes / 60);

		return pad(durationInHours) + ':' + pad(durationInMinutes % 60) + ':' + pad(durationInSeconds % 60);

	};
});
