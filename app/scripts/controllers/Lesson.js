'use strict';

angular.module('lergoApp').controller('LessonCtrl', function($scope, $log, LergoClient, $location, $routeParams, localStorageService, $timeout) {
	$scope.lesson = {
		'name' : 'New Lesson',
		'steps' : []
	};
	$scope.isSaved = true;
	var timeout = null;

	$scope.create = function() {
		LergoClient.createLesson($scope.lesson).then(function(result) {
			$log.info('got success');
			$scope.lesson = result.data.Lesson;
			$location.path('/user/lesson/' + $scope.lesson._id + '/update');
		}, function() {
			$log.error('got error');
		});
	};

	$scope.stepTypes = [ {
		'id' : 'video',
		'label' : 'Video'
	}, {
		'id' : 'quiz',
		'label' : 'Quiz'
	} ];

	$scope.quizTypes = [ {
		'id' : 'test',
		'label' : 'Test'
	}, {
		'id' : 'exercise',
		'label' : 'Exercise'
	} ];

	$scope.addStep = function(lesson) {
		if (!lesson.steps) {
			lesson.steps = [];
		}

		lesson.steps.push({});
	};
	$scope.moveStepUp = function(index) {
		var temp = $scope.lesson.steps[index - 1];
		if (temp) {
			$scope.lesson.steps[index - 1] = $scope.lesson.steps[index];
			$scope.lesson.steps[index] = temp;
		}
	};
	$scope.moveStepDown = function(index) {
		var temp = $scope.lesson.steps[index + 1];
		if (temp) {
			$scope.lesson.steps[index + 1] = $scope.lesson.steps[index];
			$scope.lesson.steps[index] = temp;
		}

	};
	$scope.getStepViewByType = function(step) {
		var type = 'none';
		if (!!step && !!step.type) {
			type = step.type.id;
		}
		return 'views/lesson/steps/_' + type + '.html';
	};

	$scope.deleteLesson = function(lesson) {
		var canDelete = window.confirm('Are yoy sure to delete Lesson : ' + lesson.name + ' ?');
		if (canDelete) {
			LergoClient.deleteLesson(lesson._id).then(function() {
				$log.info('Deleted sucessfully');
				$scope.getAll();
			}, function() {
				$log.error('got error');
			});
		}
	};

	// TODO: return true iff lesson from backend and lesson in localstorage have
	// the same version
	function versionMatch() {
		return true;
	}

	$scope.save = function() {
		if ($scope.saving) {
			return; // already saving
		}
		$scope.saving = true;
		LergoClient.updateLesson($routeParams.id, localStorageService.get($routeParams.id)).then(function() {

			if (versionMatch()) {
				$scope.isSaved = true;
			}
			$scope.saving = false;
			$log.info('got success');
		}, function() {
			$log.error('got error');
			$scope.saving = false;
			if (timeout) {
				$timeout.cancel(timeout);
			}
			timeout = $timeout($scope.save, 100);
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
			var answer = window.confirm('You have unsaved changes.Are you sure you want to leave this page?');
			if (!answer) {
				event.preventDefault();
			}
		}
	});
});
