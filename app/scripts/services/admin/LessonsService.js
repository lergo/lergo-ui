'use strict';

angular.module('lergoApp')
    .service('AdminLessonsService', function AdminLessonsService($http) {
        this.getLessons = function () {
            return $http.get('/backend/admin/lessons');
        };

        this.update = function (lesson) {
            return $http.post('/backend/admin/lessons/' + lesson._id, lesson);
        }
    });
