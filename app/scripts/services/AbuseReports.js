'use strict';

angular.module('lergoApp').service('AbuseReports', function Abusereports($http) {
	this.abuseLesson = function(obj, item) {
		obj.itemType = 'lesson';
		return $http.post('/backend/reportabuse/' + item._id + '/abuse', obj);
	};
});
