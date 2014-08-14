'use strict';

angular.module('lergoApp').controller('BaseLayoutCreateCtrl', function($scope, $route, $location) {
	$scope.$route = $route;
	$scope.isQuestionTabActive = $scope.$route.current.activeTab === 'questions';
	$scope.isLessonTabActive = $scope.$route.current.activeTab === 'lessons';
	$scope.isReportTabActive = $scope.$route.current.activeTab === 'reports';
	$scope.questionTabActive = function() {
		$location.path('user/create/questions');
	};

	$scope.lessonTabActive = function() {
		$location.path('user/create/lessons');
	};

	$scope.reportTabActive = function() {
		$location.path('user/create/reports');
	};
});
