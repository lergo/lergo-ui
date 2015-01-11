'use strict';

angular.module('lergoApp').service('UsersService', function UsersService($http) {
	this.getAll = function() {
		return $http.get('/backend/users/get/all');
	};

	this.getUsernames = function(like) {
		return $http({
			'url' : '/backend/users/usernames',
			'method' : 'GET',
			params : {
				'like' : like
			}
		});
	};

	this.findUsersById = function(ids) {
		return $http({
			'url' : '/backend/users/find',
			'method' : 'GET',
			params : {
				'usersId' : ids
			}
		});
	};

	this.getMyProfile = function() {
		return $http({
			url : '/backend/users/me/profile',
			method : 'GET',
		});
	};

	this.getPublicProfile = function(user) {
		return $http({
			url : '/backend/public/profile',
			method : 'GET',
			params : {
				userId : user._id
			}
		});
	};

	this.update = function(user) {
		return $http.post('/backend/users/me/profile/update', user);
	};

});
