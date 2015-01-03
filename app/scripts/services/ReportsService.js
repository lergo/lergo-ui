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

        this.continueLessonUrl = function(report){
            if ( !!report ) {
//            http://localhost:9000/#!/public/lessons/invitations/54a7a46d63abbaf42baf8aef/display?lessonId=53ca325179cee56d19e61548&lergoLanguage=en&reportId=54a7a46d63abbaf42baf8af0&currentStepIndex=0
                return '/#!/public/lessons/invitations/' + report.invitationId + '/display?lessonId=' + report.data.lessonId + '&reportId=' + report._id + '&currentStepIndex=' + this.countCompletedSteps(report);
            }else{
                return 'N/A';
            }
        };

        this.countCompletedSteps = function(report){
            var completedSteps = 0;
            _.each(report.stepDurations, function(elem) {
                if (angular.isNumber(elem.startTime) && angular.isNumber(elem.endTime)) {
                    completedSteps++;
                }
            });
            return completedSteps;
        };

        this.isCompleted = function(report){
            return !!report && !!report.data && !!report.data.lesson && !!report.data.lesson.steps && report.data.lesson.steps.length === this.countCompletedSteps(report);
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
