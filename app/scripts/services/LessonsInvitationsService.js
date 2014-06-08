'use strict';

angular.module('lergoApp')
    .service('LessonsInvitationsService', function LessonsInvitationsService($http) {


        this.create = function (lessonId, invitation) {
            return $http.post('/backend/user/lessons/' + lessonId + '/invitations/create', invitation);
        };

        this.report = function( invitationId, report ){
            return $http.post('/backend/lessonsinvitations/' + invitationId + '/report', report );
        };

        this.sendReportReady = function( invitationId ){
            return $http.post('/backend/lessonsinvitations/' + invitationId + '/reportReady');
        };

        this.getReport = function( invitationId ){
            return $http.get('/backend/lessonsinvitations/' + invitationId + '/getReport');
        };

        this.build = function (invitationId, constructLesson, forceConstruct) {
            return $http({
                url: '/backend/lessonsinvitations/' + invitationId + '/build',
                method: 'GET',
                params: { construct: constructLesson, forceConstruct: forceConstruct}
            });

        };

    });
