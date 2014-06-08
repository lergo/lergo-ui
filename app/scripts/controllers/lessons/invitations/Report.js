'use strict';

angular.module('lergoApp')
  .controller('LessonsInvitationsReportCtrl', function ($scope, $log, LergoClient, $routeParams ) {
        $log.info('loading');
        debugger;
        LergoClient.lessonsInvitations.getReport( $routeParams.invitationId ).then( function( result ){
            $scope.report = result.data;
        })

  });
