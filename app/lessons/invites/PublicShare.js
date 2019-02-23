(function(){
    'use strict';
    LessonsInvitesPublicShareCtrl.$inject = ['$log', '$routeParams', 'LergoClient', '$location'];
    function LessonsInvitesPublicShareCtrl($log, $routeParams, LergoClient, $location) {
        var lessonId = $routeParams.lessonId;
        $log.info('sharing', lessonId);

        LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function(result){
            $log.info('got success');
            $location.path('/public/lessons/invitations/' + result.data._id + '/display');
        }, function(){
            $log.info('I got an error');
        });
    }
    angular.module('lergoApp')
        .controller('LessonsInvitesPublicShareCtrl',LessonsInvitesPublicShareCtrl);
})();