'use strict';

angular.module('lergoApp')
    .service('AdminClientService', function AdminClientService(AdminLessonsService) {
        this.lessons = AdminLessonsService;
    });
