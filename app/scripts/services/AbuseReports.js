'use strict';

angular.module('lergoApp').service('AbuseReports', function Abusereports($http) {

    /**
     *
     * @description
     * sends an abuse report about a lesson
     *
     * @param obj the report
     * @param item the lesson
     * @returns {HttpPromise}
     */
	this.abuseLesson = function(obj, item) {
		obj.itemType = 'lesson';
		return $http.post('/backend/reportabuse/' + item._id + '/abuse', obj);
	};
	this.getAll = function(queryObj) {
		if (!queryObj) {
			throw new Error('should have at least a query object with pagination..');
		}
		return $http({
			'method' : 'GET',
			'url' : '/backend/abuseReports/get/all',
			'params' : {
				'query' : queryObj
			}

		});
	};
	this.deleteReports = function(id) {
		return $http.post('/backend/abuseReports/' + id + '/delete');
	};
	this.update = function(report) {
		return $http.post('/backend/abuseReports/' + report._id + '/update', report);
	};
});
