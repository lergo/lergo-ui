'use strict';

angular.module('lergoApp')
    .service('UserDataService', function UserDataService($http) {

        this.getLessons = function () {
            return $http.get('/backend/user/me/lessons');
        };
        // AngularJS will instantiate a singleton by calling "new" on this function
    });
