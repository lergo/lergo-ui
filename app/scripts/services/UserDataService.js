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
	this.getPlaylists = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/playlists',
			'params' : {
				'query' : queryObj
			}
		});
	};

	this.getLikedLessons = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/liked/lessons',
			'params' : {
				'query' : queryObj
			}
		});
	};
	this.getLikedPlaylists = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/liked/playlists',
			'params' : {
				'query' : queryObj
			}
		});
	};
	this.getCompletedLessons = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/completed/lessons',
			'params' : {
				'query' : queryObj
			}
		});
	};
 
	this.getQuestions = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/questions',
			'params' : {
				'query' : queryObj
			}
		});
	};
	this.getLikedQuestions = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/liked/questions',
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
	this.getPlaylistRprts = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/playlistRprts',
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
	this.getStudentsPlaylistRprts = function(queryObj) {
		return $http({
			'method' : 'GET',
			'url' : '/backend/user/me/studentsPlaylistReports',
			'params' : {
				'query' : queryObj
			}

		});
	};

    this.getClassReports = function(queryObj) {
        return $http({
            'method' : 'GET',
            'url' : '/backend/user/me/classReports',
            'params' : {
                'query' : queryObj
            }
        });
	};
	
	this.getClassPlaylistRprts = function(queryObj) {
        return $http({
            'method' : 'GET',
            'url' : '/backend/user/me/classPlaylistRprts',
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
