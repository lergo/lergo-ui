'use strict';

angular.module('lergoApp')
    .service('UsersService', function UsersService($http) {
        this.getAll = function () {
            return $http.get('/backend/users/get/all');
        };


        this.getUsernames = function( like ){
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
    });
