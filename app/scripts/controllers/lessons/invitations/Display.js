'use strict';

angular.module('lergoApp')
  .controller('LessonsInvitationsDisplayCtrl', function ($scope, LergoClient, $routeParams, $log, $controller ) {

        $log.info('loading invitation', $routeParams.invitationId);
        $controller('LessonsDisplayCtrl', {$scope: $scope});





        LergoClient.lessonsInvitations.build( $routeParams.invitationId, true, false).then(function(result){
            $scope.invitation = result.data;
            $scope.lesson = result.data.lesson;
            $scope.questions = {};
            $scope.reportContainer = result.data;
            $controller('LessonsReportWriteCtrl', {$scope: $scope});
            var items = result.data.quizItems;
            if ( !items ){
                return;
            }
            for ( var i = 0; i < items.length; i ++){
                var item = items[i];
                $scope.questions[ item._id ] = item;


            }
        });

  });
