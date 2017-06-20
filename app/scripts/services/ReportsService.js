'use strict';

angular.module('lergoApp')
    .service('ReportsService', function ReportsService($log, $http) {
        // AngularJS will instantiate a singleton by calling "new" on this function


        this.getById = function (reportId) {
            return $http.get('/backend/reports/' + reportId + '/read');
        };

        this.getClassReportById = function (reportId) {
            return $http.get('/backend/reports/class/' + reportId + '/read');
        };

        this.findStudentLesson = function (like) {
            return $http({
                method: 'GET',
                url: '/backend/reports/studentslessons/find',
                params: {
                    like: like
                }
            });
        };

        this.findLesson = function (like, reportType) {
            return $http({
                method: 'GET',
                url: '/backend/reports/lessons/find',
                params: {
                    'like': like,
                    'reportType': reportType
                }
            });
        };

        this.continueLessonUrl = function (report) {
            if (!!report) {
                /* http://localhost:9000/#!/public/lessons/invitations/54a7a46d63abbaf42baf8aef/display?
                 * lessonId=53ca325179cee56d19e61548&
                 * lergoLanguage=en&
                 * reportId=54a7a46d63abbaf42baf8af0&
                 * currentStepIndex=0 */
                return '/#!/public/lessons/invitations/' + report.invitationId +
                    '/display?lessonId=' + report.data.lessonId + '&reportId=' +
                    report._id + '&currentStepIndex=' + this.countCompletedSteps(report);
            } else {
                return 'N/A';
            }
        };

        this.countCompletedSteps = function (report) {
            var completedSteps = 0;
            _.each(report.stepDurations, function (elem) {
                if (angular.isNumber(elem.startTime) && angular.isNumber(elem.endTime)) {
                    completedSteps++;
                }
            });
            return completedSteps;
        };

        /**
         * Report is not completed if
         * 1. Report is null
         *
         *
         * @param report
         * @returns {boolean}
         */
        this.isCompleted = function (report) {
            if (!report) {
                return false;
            }
            /*  guy - adding this to :
             *  (1) shorten the process
             *  (2) fix bug where invitation is deleted and then suddenly 'incomplete' appears in reports index page.
             *  return true; */
            else if (report.finished) {
                return true;
            }
            else {
                var allStepsCompleted = report.data.lesson.steps.length === this.countCompletedSteps(report);
                return !!report.data && !!report.data.lesson && !!report.data.lesson.steps && allStepsCompleted;
            }
        };

        /**
         *
         * find an existing answer for specific question in specific step identified by index.
         *
         * @param report the report
         * @param quizItemId id of quizItem we want answer for
         * @param stepIndex the step identified by index in lesson steps.
         * @returns {null|object} null if no answer, otherwise returns the answer
         */
        //
        //
        this.getAnswerToQuizItem = function (report, quizItemId, stepIndex) {
            var result = _.find(report.answers, function (item) {
                return (item.quizItemId === quizItemId) && (item.stepIndex === stepIndex);
            });
            if (!result) {
                return null; // make sure to return null, and not any other value like undefined
            }
            return result;
        };

        /**
         * turns list of answers for specific step to a map of quizItemId and the answer.
         *
         * @param report the report
         * @param stepIndex step we are interested in
         * @returns {object} a map between quiz item id, and the answer
         */
        this.getAnswersByQuizItemId = function (report, stepIndex) {
            var result = {};
            _.each(report.answers, function (item) {
                if (item.stepIndex === stepIndex) {
                    result[item.quizItemId] = item;
                }
            });
            return result;
        };


        /**
         *
         * @param invitation
         * @param overrides - a temporary solution for allowing users to register their names for each report.
         *                      contains 'invitee' details in the same structure as it appears on invitation.
         *                      it will be applied on update, which should happen as soon as lesson starts.
         * @returns {*}
         */
        this.createFromInvitation = function (invitation, overrides) {
            return $http.post('/backend/reports/lessoninvitation/' + invitation._id, overrides);
        };

        this.update = function (report) {
            return $http.post('/backend/reports/' + report._id + '/update', report);
        };

        this.ready = function (reportId) {
            if (typeof(reportId) === 'object') {
                return $http.post('/backend/reports/' + reportId._id + '/ready');
            } else {
                return $http.post('/backend/reports/' + reportId + '/ready');
            }

        };

        this.deleteReport = function (report) {
            return $http.post('/backend/reports/' + report._id + '/delete');
        };

        this.getStudents = function () {
            return $http.get('/backend/reports/students');
        };

        this.getClasses = function () {
            return $http.get('/backend/reports/classes');
        };
    });
