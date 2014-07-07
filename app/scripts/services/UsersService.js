'use strict';

angular.module('lergoApp')
    .service('UsersService', function UsersService($http) {
        this.getAll = function () {
            return $http.get('/backend/users/get/all');
        }
    });
