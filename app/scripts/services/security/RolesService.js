'use strict';

/**
 * @ngdoc service
 * @name lergoApp.security/RolesService
 * @description
 * # security/RolesService
 * Service in the lergoApp.
 */
angular.module('lergoApp')
    .service('RolesService', function ($log, $http) {
        /**
         * @description
         * creates a role
         * @returns {promise}
         */
        this.create = function () {
            $log.info('creating role');
            return $http({ 'url' : '/backend/security/roles', 'method' : 'POST' });
        };

        /**
         * @description gets a role by id
         * @param {string} roleId - roleId
         * @returns {promise}
         */
        this.read = function( roleId ){
            if ( !roleId ){
                throw new Error('missing roleId');
            }
            $log.info('getting role');
            return $http({'url': '/backend/security/roles/' + roleId,'method' : 'GET'});
        };

        this.getPermissions = function(){
            return $http.get('/backend/security/permissions');
        };


        /**
         * @description update role
         * @param {Role} role - the role to update
         * @returns {promise}
         */
        this.update = function(  role ){
            if ( !role || !role._id ){
                throw new Error('missind role._id');
            }
            $log.info('updating role');
            return $http({'url' : '/backend/security/roles/' + role._id ,'method' : 'POST', 'data' : role });
        };

        this.list = function( queryObj ){
            return $http({ 'url' : '/backend/security/roles', 'method': 'GET' , 'params' : { query: queryObj } });
        };

        /**
         * @description - deletes a role by id
         * @param {string} roleId - roleId to delete
         * @return {promise}
         */
        this.delete = function( roleId ){
            if ( !roleId ){
                throw new Error('missing roleId');
            }
            $log.info('deleting role', roleId);
            return $http({'url' : '/backend/security/roles/' + roleId , 'method' : 'DELETE'});
        };
        // AngularJS will instantiate a singleton by calling "new" on this function
    });
