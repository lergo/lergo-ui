'use strict';

angular.module('lergoApp').service('UserDataService', function UserDataService($http) {

	this.getLessons = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/lessons',
			'params' : {
				'query' : queryObj
			}
		});
	};
	// AngularJS will instantiate a singleton by calling "new" on this
	// function

	this.getReports = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/reports',
			'params' : {
				'query' : queryObj
			}
		});
	};

	this.getStudentsReports = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/studentsReports',
			'params' : {
				'query' : queryObj
			}

		});
	};

	this.getInvites = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/invites',
			'params' : {
				'query' : queryObj
			}

		});
	};
});
