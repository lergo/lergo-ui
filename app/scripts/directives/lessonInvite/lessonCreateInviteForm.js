'use strict';

angular.module('lergoApp').directive('lessonCreateInviteForm', function($log, LergoClient, $routeParams) {
    return {
        restrict: 'A',
        templateUrl: 'views/lessons/intro/_inviteForm.html',
        scope: {
            'onClose' : '&'
        },
        link: function($scope/*,element,attrs*/){

            var invitation = null;
            var lessonId = $routeParams.lessonId;

            var Modes = {
                CLASS: 'class',
                STUDENT: 'student'
            };

            $scope.mode = Modes.STUDENT;

            $scope.setMode = function( mode ){
                $scope.mode = mode;
            };

            $scope.setClassMode = function(){
                $scope.setMode(Modes.CLASS);
            };

            $scope.setStudentMode = function(){
                $scope.setMode(Modes.STUDENT);
            };

            $scope.isClassMode = function(){
                return $scope.mode === Modes.CLASS;
            };

            $scope.isStudentMode = function(){
                return $scope.mode === Modes.STUDENT;
            };

            var user;
            var token;
            LergoClient.isLoggedIn(true).then(function( result ){
                user = result.data.user;
                token = result.data.token;
                return result;
            });

            $scope.getClassLink = function(){
                if ( user && invitation) {
                    return window.location.origin + '/index.html#!/public/lessons/' + lessonId + '/classInvite?invitationId=' + invitation._id;
                }
                return '';
            };



            $scope.invite = {
                'lessonId' : lessonId,
                'invitee' : {}
            };

            $scope.getLink = function() {
                if (invitation !== null) {
                    if (  invitation.invitee.name ) {
                        return LergoClient.lessonsInvitations.getLink(invitation);
                    }else if ( invitation.invitee.class ){
                        return $scope.getClassLink();
                    }
                }
            };

            $scope.newInvite = function() {
                $scope.createSuccess = false;
                $scope.invite.invitee = {};
            };


            $scope.sendInvite = function() {
                $scope.createError = false;
                $scope.createSuccess = false;
                $log.info('inviting', $scope.invite);
                LergoClient.lessonsInvitations.create($routeParams.lessonId, $scope.invite).then(function(result) {
                    invitation = result.data;
                    $log.info('after invitation');
                    $scope.createSuccess = true;
                }, function() {
                    $scope.createError = true;
                });
            };
            $scope.enterPressed = function() {
                if ($scope.createSuccess) {
                    $scope.newInvite();
                } else if (!!$scope.invite.invitee.name || !!$scope.invite.invitee.class ) {
                    $scope.sendInvite();
                }
            };
        }
    };


});
