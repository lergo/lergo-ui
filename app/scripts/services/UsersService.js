'use strict';

angular.module('lergoApp').service('UsersService', function UsersService($http, $rootScope , $q ) {

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

    var me = this;

    $rootScope.$watch('user', function( ){
        permissionsPromise = null;
        me.getUserPermissions();
    });

    var permissionsPromise;
    this.getUserPermissions = function(){
        if ( !permissionsPromise ){
            permissionsPromise = $http.get('/backend/user/permissions').then(function( result ){

                // lets convert this to nested object
                // http://stackoverflow.com/a/30723988/1068746
                var permissions = {};
                _.each(result.data, function( permission ){
                    _.set(permissions, permission,true);
                });
                return permissions;

            }, function( result ){
                return $q.reject(result);
            });
        }
        return permissionsPromise;
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
            url : '/backend/public/'+username+'/profile',
            method : 'GET'
        });
    };

	this.update = function(user) {
		return $http.post('/backend/users/me/profile/update', user);
	};

});
