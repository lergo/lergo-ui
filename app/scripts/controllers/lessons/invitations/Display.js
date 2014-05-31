'use strict';

angular.module('lergoApp')
  .controller('LessonsInvitationsDisplayCtrl', function ($scope, LergoClient, $routeParams, $log, $controller ) {

        $log.info('loading invitation', $routeParams.invitationId);
        $controller('LessonsDisplayCtrl', {$scope: $scope});

        LergoClient.lessonsInvitations.build( $routeParams.invitationId, true, false).then(function(result){
            $scope.lesson = result.data.lesson;
            $scope.questions = [];
            var items = result.data.lesson.quizItems;
            if ( !items ){
                return;
            }
            for ( var i = 0; i < items.length; i ++){
                var item = items[i];
                $scope.questions[ item._id ] = item;
            }
        });

  });
