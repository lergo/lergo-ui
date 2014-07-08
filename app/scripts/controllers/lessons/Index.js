'use strict';

angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient, $location, FilterService) {
	$scope.lessons = null;

	$scope.ageFilter = function(lesson) {
		return FilterService.filterByAge(lesson.age);
	};
	$scope.languageFilter = function(lesson) {
		return FilterService.filterByLanguage(lesson.language);
	};
	$scope.subjectFilter = function(lesson) {
		return FilterService.filterBySubject(lesson.subject);
	};


	$scope.getAll = function() {
		LergoClient.userData.getLessons().then(function(result) {
			$scope.lessons = result.data;
			$scope.errorMessage = null;
			$log.info('Lesson fetched successfully');
		}, function(result) {
			$scope.errorMessage = 'Error in fetching Lessons : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};
    $scope.getAll();

	$scope.$on('$viewContentLoaded', function() {
		$scope.getAll();
	});

	$scope.create = function() {
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			$scope.errorMessage = null;
			$location.path('/user/lesson/' + lesson._id + '/update');
		}, function(result) {
			$scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};

});
