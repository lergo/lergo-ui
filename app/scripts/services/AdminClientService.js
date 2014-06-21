'use strict';

angular.module('lergoApp')
    .service('AdminClientService', function AdminClientService(AdminLessonsService, $http ) {
        this.lessons = AdminLessonsService;

        this.getAllUsers = function( ){
            return $http.get('/backend/admin/users');
        };
    });
