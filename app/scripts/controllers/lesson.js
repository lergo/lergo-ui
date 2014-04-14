'use strict';

angular.module('lergoApp').controller('LessonCtrl', function($scope, $log, LergoClient, $location, $routeParams) {
	$scope.lesson = {
		'name' : undefined
	};

	$scope.lessons = null;

	$scope.create = function() {
		LergoClient.createLesson($scope.lesson).then(function(result) {
			$log.info('got success');
			$scope.lesson = result.data.Lesson;
			$location.path('/public/user/lesson/' + $scope.lesson._id + '/update');
		}, function() {
			$log.error('got error');
		});
	};
	$scope.getAll = function() {
		LergoClient.getLessons().then(function(result) {
			$scope.lessons = result.data.Lessons;
			$log.info('got success');
		}, function() {
			$log.error('got error');
		});
	};
	$scope.deleteLesson = function(lesson) {

		var canDelete = confirm('Are yoy sure to delete Lesson : ' + lesson.name + ' ?');
		if (canDelete) {
			LergoClient.deleteLesson(lesson._id).then(function() {
				$log.info('Deleted sucessfully');
				$scope.getAll();
			}, function() {
				$log.error('got error');
			});
		}
	};
	$scope.edit = function() {
		if ($routeParams.id) {
			LergoClient.getLessonById($routeParams.id).then(function(result) {
				$scope.lesson = result.data.Lesson;
				$log.info('get the lesson' + result.data.Lesson);
			}, function() {

			});
		}
	};
	$scope.save = function(lesson) {
		LergoClient.updateLesson($routeParams.id, lesson).then(function() {
			$log.info('got success');
			$scope.getAll();
		}, function() {
			$log.error('got error');
		});
	};
	$scope.getAll();
	$scope.edit();
	$scope.doneWithUpdating = function(lesson) {
		$scope.save($scope.lesson);
		$location.path('/public/user/lessons');
	};

	$scope.$watch('lesson', function() {
		// $scope.save($scope.lesson);
	}, true);
});
