'use strict';

angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient, $location, FilterService, $rootScope, TagsService) {
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

    $scope.tagsFilter = function(lesson){
        return FilterService.filterByTags( lesson.tags );
    };

	$scope.getAll = function() {
		LergoClient.userData.getLessons().then(function(result) {
			$scope.lessons = result.data;
			$scope.errorMessage = null;
            $scope.availableTags = TagsService.getTagsFromItems( $scope.lessons );
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
	$scope.$on('$locationChangeStart', function() {
		$rootScope.lessonScrollPosition = window.scrollY;
	});
	window.scrollTo(0, $rootScope.lessonScrollPosition);
});
