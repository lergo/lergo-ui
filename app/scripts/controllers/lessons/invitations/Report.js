'use strict';

angular.module('lergoApp').controller('LessonsInvitationsReportCtrl', function($scope, $log, LergoClient, $routeParams, $rootScope) {
	$log.info('loading');
	LergoClient.reports.getById($routeParams.reportId).then(function(result) {
		$scope.report = result.data;
		$rootScope.page = {
			'title' : $scope.report.data.lesson.name,
			'description' : $scope.report.data.lesson.description
		};
	});
	$scope.stats = [];
	$scope.$on('stats', function(event, data) {
		$scope.stats[data.index] = data;
	});

	$scope.absoluteShareLink = function(id) {
		return window.location.origin + '/#!/public/lessons/' + id + '/intro';
	};

});
