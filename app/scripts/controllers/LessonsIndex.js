'use strict';

angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient) {
	$scope.lessons = null;
	$scope.getAll = function() {
		LergoClient.getLessons().then(function(result) {
			$scope.lessons = result.data.Lessons;
			$log.info('got success');
		}, function() {
			$log.error('got error');
		});
	};
	$scope.$on('$viewContentLoaded', function() {
		$scope.getAll();
	});
});
