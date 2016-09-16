'use strict';
/**
 * this code might require more work.
 * I decided to have 2 directives in same file because the parent directive
 * seems redundant and I would like to find a way to remove it altogether.
 * conceptually I couldn't bring myself to create a file for it..
 *
 * Not sure if I like angular-bootstrap tabs implementation, even though it might be suitable here.
 *
 * I want to check :
 * https://thinkster.io/angular-tabs-directive
 * before I decide
 *
 */

angular.module('lergoApp').directive('lessonCreateInviteFormItem', function(LergoClient, $routeParams, $log){

    return {
        restrict: 'A',
        scope:{
            mode: '@lessonCreateInviteFormItem'
        },
        templateUrl: 'inline_lessonCreateInviteFormItem.html',
        link: function($scope){
            var invitation = null;
            var lessonId = $routeParams.lessonId;
            var user = null;
            var invite = null;

            $scope.newInvite = function(){
                invitation = null;
                $scope.invitationName = null;
                invite = {
                    'lessonId' : lessonId,
                    'invitee' : {}
                };
            };

            $scope.newInvite();

            LergoClient.isLoggedIn(true).then(function( result ){
                user = result.data.user;
                return result;
            });

            function isClassMode (){
                return $scope.mode === 'class';
            }

            function isStudentMode(){
                return $scope.mode === 'student';
            }

            $scope.$watch('invitationName', function(newValue){
                if ( isClassMode() ){
                    invite.invitee.class = newValue;

                }else if ( isStudentMode() ){
                    invite.invitee.name = newValue;
                }
            });

            $scope.getLink = function(){
                if ( !invitation ){
                    return;
                }
                if ( isStudentMode()){
                    return LergoClient.lessonsInvitations.getLink(invitation);
                }
                if ( isClassMode()) {
                    return window.location.origin + '/index.html#!/public/lessons/' + lessonId + '/classInvite?invitationId=' + invitation._id;
                }
                return '';
            };


            $scope.isSuccess = function(){
                return !!invitation;
            };

            $scope.sendInvite = function () {
                $scope.createError = false;
                $log.info('inviting', invite);
                return LergoClient.lessonsInvitations.create($routeParams.lessonId, invite).then(function (result) {
                    invitation = result.data;
                }, function () {
                    $scope.createError = true;
                });
            };

            $scope.isValid = function(){
                if ( isStudentMode() ){
                    return !!invite.invitee.name;
                }else if ( isClassMode()){
                    return !!invite.invitee.class;
                }
                return false;
            };

            $scope.enterPressed = function(){
                if ( $scope.isSuccess() ) {
                    $scope.newInvite();
                } else if ( !!$scope.isValid()) {
                    $scope.sendInvite();
                }
            };
        }
    };
});

angular.module('lergoApp').directive('lessonCreateInviteForm', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/lessons/intro/_inviteForm.html',
        scope: {
            'onClose' : '&'
        },
        link: function($scope/*,element,attrs*/){

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
        }
    };
});

/*jeff: added this directive to separate between the invite before the
lesson and after lesson. This was the only way I could get the format
of the invite form after the lesson not to change the way (good way)
the invite before the lesson looked*/

angular.module('lergoApp').directive('lessonCreateInviteFormAfter', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/lessons/intro/_inviteFormAfter.html',
        scope: {
            'onCloseAfter' : '&'
        },
        link: function($scope/*,element,attrs*/){

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
        }
    };
});

