'use strict';

angular.module('lergoApp')
    .service('ReportsService', function ReportsService($log, $http) {
        // AngularJS will instantiate a singleton by calling "new" on this function


        this.getById = function (reportId) {
            return $http.get('/backend/reports/' + reportId + '/read');
        };


        this.createFromInvitation = function (invitation) {
            return $http.post('/backend/reports/lessoninvitation/' + invitation._id);
        };

        this.update = function (report) {
            return $http.post('/backend/reports/' + report._id + '/update', report);
        };

        this.ready = function (reportId) {
            return $http.post('/backend/reports/' + reportId + '/ready');
        };
    });
