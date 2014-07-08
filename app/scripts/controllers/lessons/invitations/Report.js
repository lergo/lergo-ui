'use strict';

angular.module('lergoApp').controller('LessonsInvitationsReportCtrl', function($scope, $log, LergoClient, $routeParams) {
	$log.info('loading');
	LergoClient.lessonsInvitations.getReport($routeParams.invitationId).then(function(result) {
		$scope.report = result.data;
	});
	$scope.stats=[];
	$scope.$on('stats', function(event, data) {
		$scope.stats[data.index] = data;
	});

});
