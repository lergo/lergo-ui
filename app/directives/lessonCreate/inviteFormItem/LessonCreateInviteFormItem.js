(function(){
    'use strict';
    function lessonCreateInviteFormItem(LergoClient, $routeParams, $log){

        return {
            restrict: 'A',
            scope:{
                mode: '@lessonCreateInviteFormItem',
                copied: '@'
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

                $scope.getPin = function(){
                    if ( !invitation ){
                        return;
                    }
                    return invitation.pin;
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
    }
    angular.module('lergoApp')
        .directive('lessonCreateInviteFormItem', lessonCreateInviteFormItem);
})();