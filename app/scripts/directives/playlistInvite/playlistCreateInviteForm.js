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

angular.module('lergoApp').directive('playlistCreateInviteFormItem', function(LergoClient, $routeParams, $log){

    return {
        restrict: 'A',
        scope:{
            mode: '@playlistCreateInviteFormItem',
            copied: '@'
        },
        templateUrl: 'inline_playlistCreateInviteFormItem.html',
        link: function($scope){
            var invitation = null;
            var playlistId = $routeParams.playlistId;
            var user = null;
            var invite = null;

            $scope.newInvite = function(){
                invitation = null;
                $scope.invitationName = null;
                invite = {
                    'playlistId' : playlistId,
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
                    return LergoClient.playlistsInvitations.getLink(invitation);
                }
                if ( isClassMode()) {
                    return window.location.origin + '/index.html#!/public/playlists/' + playlistId + '/classInvite?invitationId=' + invitation._id;
                }
                return '';
            };

            $scope.getPin = function(){
                if ( !invitation ){
                    return;
                }
                return invitation.pin;
            };



            $scope.isSuccess = function(){
                return !!invitation;
            };
            var inviteArray = [];
            var lessonId; 
            var lessonInvite = {};
            async function lessonInviteFunction() {
                for (lessonId of lessonsArray) {
                    lessonInvite = {
                        'invitee': { 'name' : invite.invitee },
                        'lessonId': lessonId
                    }
                // wait for this to resolve and after that move to next lesson
                let result = await LergoClient.lessonsInvitations.create(lessonId, lessonInvite);
                var lessonInvitationId = result.data._id;
                
                var  playlistLessonInvitation = { 
                    'lesson' : { 'lessonId' : lessonId },
                    'invitationId' : lessonInvitationId
                } 
            
                inviteArray.push(playlistLessonInvitation)
                console.log('the inviteArray is :', inviteArray) 
                }           
            }
            invite.lessonInvitation = [];
            var lessonsArray = [];
            $scope.sendInvite = function () {

                $scope.createError = false;
                $log.info('inviting');
                console.log(' the playlist invite is ', invite);
                // creating and adding an invitation for each lesson in the playlist
                    LergoClient.playlists.getById( invite.playlistId).then(function(result){
                        lessonsArray = result.data.steps[0].quizItems;
                        // for each lesson make an invitation and get the invitationId
                        lessonInviteFunction().then(function() {
                            invite.lessonInvitation = inviteArray;
                            return LergoClient.playlistsInvitations.create($routeParams.playlistId, invite).then(function (result) {
                                invitation = result.data;
                            }, function () {
                                $scope.createError = true;
                            });
                        });
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

angular.module('lergoApp').directive('playlistCreateInviteForm', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/playlists/intro/_inviteForm.html',
        scope: {
            'onClose' : '&'
        },
        link: function($scope/*,element,attrs*/){

            var Modes = {
                CLASS: 'class',
                STUDENT: 'student'
            };

            $scope.mode = Modes.CLASS;

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
playlist and after playlist. This was the only way I could get the format
of the invite form after the playlist not to change the way (good way)
the invite before the playlist looked*/

angular.module('lergoApp').directive('playlistCreateInviteFormAfter', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/playlists/intro/_inviteFormAfter.html',
        scope: {
            'onCloseAfter' : '&'
        },
        link: function($scope/*,element,attrs*/){

            var Modes = {
                CLASS: 'class',
                STUDENT: 'student'
            };

            $scope.mode = Modes.CLASS;

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

