'use strict';

/**
 * @ngdoc service
 * @name lergoApp.security/GroupsService
 * @description
 * # security/GroupsService
 * Service in the lergoApp.
 */
angular.module('lergoApp')
    .service('GroupsService', function ($log, $http ) {
        /**
         * @description
         * creates a group
         * @returns {promise}
         */
        this.create = function () {
            $log.info('creating group');
            return $http({ 'url' : '/backend/security/groups', 'method' : 'POST' });
        };

        /**
         * @description gets a group by id
         * @param {string} groupId
         * @returns {promise}
         */
        this.read = function( groupId ){
            if ( !groupId ){
                throw new Error('missing groupId');
            }
            $log.info('getting group');
            return $http({'url': '/backend/security/groups/' + groupId,'method' : 'GET'});
        };


        /**
         * @description update group
         * @param {Group} group - the group to update
         * @returns {promise}
         */
        this.update = function(  group ){
            if ( !group || !group._id ){
                throw new Error('missind group._id');
            }
            $log.info('updating group');
            return $http({'url' : '/backend/security/groups/' + group._id ,'method' : 'POST', 'data' : group });
        };

        this.list = function( queryObj ){
            return $http({ 'url' : '/backend/security/groups', 'method': 'GET' , 'params' : { query: queryObj } });
        };

        /**
         * @description - deletes a group by id
         * @param {string} groupId - groupId to delete
         * @return {promise}
         */
        this.delete = function( groupId ){
            if ( !groupId ){
                throw new Error('missing groupId');
            }
            $log.info('deleting group', groupId);
            return $http({'url' : '/backend/security/groups/' + groupId ,'method' : 'DELETE'});
        };
    });
