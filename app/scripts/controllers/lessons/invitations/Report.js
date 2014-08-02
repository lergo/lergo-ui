'use strict';

angular.module('lergoApp').controller('LessonsInvitationsReportCtrl', function($scope, $log, LergoClient, $routeParams) {
	$log.info('loading');
	LergoClient.reports.getById($routeParams.reportId).then(function(result) {
		$scope.report = result.data;
	});
	$scope.stats=[];
	$scope.$on('stats', function(event, data) {
		$scope.stats[data.index] = data;
	});



	$scope.absoluteShareLink = function(id) {
        return window.location.origin + '/#/public/lessons/' + id + '/intro';
	};

});
