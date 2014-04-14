'use strict';

angular.module('lergoApp').controller('LessonCtrl', function($scope, $log, LergoClient, $location) {
	$scope.lesson = {
		'name' : null
	};
	$scope.lessons = null;

	$scope.create = function() {
		LergoClient.createLesson($scope.lesson).then(function() {
			$log.info('got success');
			$location.path('/public/user/Lessons');
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

		var canDelete = confirm('Are yoy sure to delete Lesson : ' + lesson.name);
		if (canDelete) {
			LergoClient.deleteLesson(lesson._id).then(function() {
				$log.info('Deleted sucessfully');
				$scope.getAll();
			}, function() {
				$log.error('got error');
			});
		}
	};
	$scope.edit = function(id) {
		LergoClient.updateLesson(id).then(function() {
			$log.info('got success');
			$scope.getAll();
		}, function() {
			$log.error('got error');
		});
	};
	$scope.getAll();
});
