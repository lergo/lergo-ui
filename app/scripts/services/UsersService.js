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

    this.getDate = function( queryObj ) {
        if ( !queryObj ){
            throw new Error('should have at least a query object with pagination..');
        }
        return $http({'method' : 'GET' ,'url' : '/backend/users/get/date', 'params' : {
            'query' : queryObj
        }});
    };

    var me = this;

    $rootScope.$watch('user', function( ){
        permissionsPromise = null;
        me.getUserPermissions();
    });

    var permissionsPromise;

    // returns an object of all permissions.
    // if the permissions are for example 'lesson.canEdit', 'lesson.canView', 'question.canEdit'
    // then this function will output { lesson : { canEdit: true, canView: true}, question: {canEdit:true} }
    this.getUserPermissions = function(){
        if ( !permissionsPromise ){
            permissionsPromise = $http.get('/backend/user/permissions').then(function( result ){

                // lets convert this to nested object
                // http://stackoverflow.com/a/30723988/1068746
                var permissions = { limitations : result.data.permissionsLimitations };
                _.each(result.data.permissions, function( permission ){
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


    /**
     *
     * @param {string} username
     * @returns {*}
     */
    this.getProfile = function (username) {
        if ( username ) {
            return $http({
                url: '/backend/users/' + username + '/profile',
                method: 'GET'
            });
        }else{
            return $http({
                url: '/backend/users/profile',
                method: 'GET'
            });
        }
    };

	this.update = function(user) {
		return $http.post('/backend/users/me/profile/update', user);
	};

});
