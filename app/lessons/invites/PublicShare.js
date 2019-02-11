'use strict';

angular.module('lergoApp')
    .controller('LessonsInvitesPublicShareCtrl', function ($log, $routeParams, LergoClient, $location ) {
        var lessonId = $routeParams.lessonId;
        $log.info('sharing', lessonId);

        LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function(result){
            $log.info('got success');
            $location.path('/public/lessons/invitations/' + result.data._id + '/display');
        }, function(){
            $log.info('I got an error');
        });
    });
