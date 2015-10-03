'use strict';

angular.module('lergoApp').service('UsersService', function UsersService($http) {

    // will get all users - including private.
    // if user not allowed, will return 400.
    this.getAll = function( queryObj ) {
        if ( !queryObj ){
            throw new Error('should have at least a query object with pagination..');
        }
        return $http({'method' : 'GET' ,'url' : '/backend/users/get/all', 'params' : {
            'query' : queryObj
        }});
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
			method : 'GET'
		});
	};

    // follow standard described at: http://williamdurand.fr/2014/02/14/please-do-not-patch-like-an-idiot/
    this.patchUserRoles = function( userId, roles ){
        return $http({
            url: '/backend/users/' + userId ,
            method: 'PATCH',
            data: {
                op: 'replace',
                path: 'roles',
                value: roles
            }
        });
    };

    this.read = function( userId ){
        return $http({
            url:'/backend/users/' + userId,
            method:'GET'
        });
    };

	this.getPublicProfile = function(username) {
		return $http({
			url : '/backend/users/'+username+'/profile',
			method : 'GET'
		});
	};

    this.getPublicProfileForNonRegUser = function(username) {
        return $http({
            url : '/backend/public/'+username+'/profile',
            method : 'GET'
        });
    };

	this.update = function(user) {
		return $http.post('/backend/users/me/profile/update', user);
	};

});
