'use strict';

/**
 * @module  LessonInvitesPublicShareCtrl
 *
 * @description
 *
 * used when we want to give a link to someone that will get them inside the lesson quickly.
 * this will create an anonymous report and redirect users to lesson immediately.
 */

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
