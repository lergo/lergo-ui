'use strict';

angular.module('lergoApp').controller('LessonCtrl', function($scope, $log, LergoClient, $location, $routeParams, localStorageService, $timeout) {
	$scope.lesson = {
		'name' : 'New Lesson'
	};
	$scope.isSaved = true;
	var timeout=null;

	$scope.create = function() {
		LergoClient.createLesson($scope.lesson).then(function(result) {
			$log.info('got success');
			$scope.lesson = result.data.Lesson;
			$location.path('/public/user/lesson/' + $scope.lesson._id + '/update');
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
	$scope.save = function() {
		$scope.isSaved = true;
		LergoClient.updateLesson($routeParams.id, localStorageService.get($routeParams.id)).then(function() {
			$log.info('got success');
		}, function() {
			$log.error('got error');
		});
	};
	var localUpdate = function(newVal, oldVal) {
		if ($routeParams.id) {
			if (newVal !== oldVal) {
				$scope.isSaved = false;
				localStorageService.add($routeParams.id, newVal);
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout($scope.save, 2000);
			}
		}
	};

	$scope.$watch('lesson', localUpdate, true);
	$scope.$on('$viewContentLoaded', function() {
		if ($routeParams.id) {
			LergoClient.getLessonById($routeParams.id).then(function(result) {
				$scope.lesson = result.data.Lesson;
				$log.info('get the lesson' + result.data.Lesson);
			}, function() {
				$log.info('get error');
			});
		}
	});

	$scope.$on('$locationChangeStart', function(event) {
		if (!$scope.isSaved) {
			var answer = confirm('You have unsaved changes.Are you sure you want to leave this page?');
			if (!answer) {
				event.preventDefault();
			}
		}
	});
});
