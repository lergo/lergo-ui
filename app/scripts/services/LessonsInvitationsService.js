(function () {
    'use strict';

    angular.module('lergoApp').service('LessonsInvitationsService', function LessonsInvitationsService($http) {

        /**
         *
         * @param {string} lessonId
         * @param {object} invitation
         * @param {object} invitation.invitee
         * @param {string} invitation.invitee.name
         * @returns {*}
         */
        this.create = function(lessonId, invitation) {
            return $http.post('/backend/lessons/' + lessonId + '/invitations/create', invitation);
        };

        this.createAnonymous = function(lessonId) {
            return $http.post('/backend/lessons/' + lessonId + '/invitations/create');
        };

        this.build = function(invitationId, constructLesson, forceConstruct) {
            return $http({
                url : '/backend/lessonsinvitations/' + invitationId + '/build',
                method : 'GET',
                params : {
                    construct : constructLesson,
                    forceConstruct : forceConstruct
                }
            });

        };
        this.update = function(invitation) {
            return $http.post('/backend/invitations/' + invitation._id + '/update', invitation);
        };

        this.getLink = function(invitation){
            return window.location.origin + '/index.html#!/public/lessons/' + invitation.lessonId + '/intro?invitationId=' + invitation._id;
        };

        this.get = function( invitationId ){
            return $http.get('/backend/invitations/' + invitationId + '/get' );
        };

        this.getByPin = function( pin ){
            return $http.get('/backend/invitations/pin/' + pin );
        };

        this.remove = function(invitation) {
            return $http.post('/backend/invitations/' + invitation._id + '/delete');
        };

        this.getStudents = function(){
            return $http.get('/backend/lessonsinvitations/students');
        };

        this.getClasses = function(){
            return $http.get('/backend/lessonsinvitations/classes');
        };

    });
})();
