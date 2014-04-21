'use strict';

angular.module('lergoApp')
  .service('LessonsService', function LessonsService() {
        this.create = function() {
            return $http.post('/backend/user/lessons');
        };
        this.getAll = function() {
            return $http.get('/backend/user/lessons');
        };
        this.delete = function(id) {
            return $http.post('/backend/user/lessons/' + id + '/delete');
        };
        this.update = function(lesson) {
            return $http.post('/backend/user/lessons/' + lesson._id, lesson);
        };
        this.getById = function(id) {
            return $http.get('/backend/user/lessons/' + id);
        };
  });
