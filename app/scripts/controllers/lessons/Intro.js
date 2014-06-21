'use strict';

angular.module('lergoApp')
  .controller('LessonsIntroCtrl', function ($scope, $routeParams, LergoClient, $location ) {
        var lessonId = $routeParams.lessonId;
        var invitationId = $routeParams.invitationId;

        LergoClient.lessons.getPublicById( lessonId).then(function(result){
            $scope.lesson = result.data;
        });

        function redirectToInvitation( ){
            $location.path('/public/lessons/invitations/' + invitationId + '/display');
            $location.path();
        }

        $scope.startLesson = function(){
            if ( !invitationId ){
                LergoClient.lessonsInvitations.createAnonymous( lessonId ).then( function(result){
                    invitationId = result.data._id;
                    redirectToInvitation();
                });
            }else{
                redirectToInvitation();
            }
        }
  });
