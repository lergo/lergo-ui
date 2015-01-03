'use strict';

angular.module('lergoApp')
    .service('ReportsService', function ReportsService($log, $http) {
        // AngularJS will instantiate a singleton by calling "new" on this function


        this.getById = function (reportId) {
            return $http.get('/backend/reports/' + reportId + '/read');
        };

        this.findLesson = function( like ){
            return $http({
                method: 'GET',
                url : '/backend/reports/lessons/find',
                params: {
                    'like' : like
                }
            });
        };


        this.createFromInvitation = function (invitation) {
            return $http.post('/backend/reports/lessoninvitation/' + invitation._id);
        };

        this.update = function (report) {
            return $http.post('/backend/reports/' + report._id + '/update', report);
        };

        this.ready = function (reportId) {
            if (typeof(reportId) === 'object'){
                return $http.post('/backend/reports/' + reportId._id + '/ready');
            }else{
                return $http.post('/backend/reports/' + reportId + '/ready');
            }

        };
        
        this.deleteReport = function (report) {
            return $http.post('/backend/reports/' + report._id + '/delete');
        };

        this.getStudents = function(){
            return $http.get('/backend/reports/students');
        };
    });
