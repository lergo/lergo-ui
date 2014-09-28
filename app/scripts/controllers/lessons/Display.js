'use strict';

angular.module('lergoApp').controller('LessonsDisplayCtrl', function($scope, $routeParams, LergoClient, $log, $controller, $rootScope, $location, shuffleFilter) {

	// guy - using this flag because ng-cloak and other solutions will not apply
	// to this scenario.
	// the display to the lesson is simply taking time, because we have to fetch
	// the lesson and the report
	// so once they are loaded, we will switch that flag to true.
	// otherwise we get a flash of the last screen (LERGO-358).
	$scope.loaded = false;

	$controller('LessonsStepDisplayCtrl', {
		$scope : $scope
	});

	$scope.currentStepIndex = parseInt($routeParams.currentStepIndex || 0, 10);
	$log.info('current step index', $scope.currentStepIndex);

	// will update step on scope
	function updateCurrentStep() {
		if ($scope.currentStepIndex >= 0) {
			if (!!$scope.lesson) {
				$scope.step = $scope.lesson.steps[$scope.currentStepIndex];
				if (!!$scope.step) {
					shuffleFilter($scope.step.quizItems, !$scope.step.shuffleQuestion);
				}
			} else {
				$scope.step = null;
			}
		}
	}

	// resolving initialization issue - in case we don't have a lesson yet, and
	// we are not at step -1, $scope.step will be null/undefined.so we listen on
	// lesson and initialize it
	if (!$scope.lesson) {
		var unwatchLesson = $scope.$watch('lesson', function(newValue) {
			if (!!newValue && $scope.currentStepIndex !== undefined) {
				updateCurrentStep();
				unwatchLesson();
			}
		});
	}

	$scope.$watch('currentStepIndex', function(newValue, oldValue) {
		$log.info('currentStepIndex changed', newValue, oldValue);
		updateCurrentStep();
		$location.search('currentStepIndex', newValue);
		$rootScope.$broadcast('stepIndexChange', {
			'old' : oldValue,
			'new' : newValue
		});
	});

	$scope.$watch(function() {
		return $routeParams.currentStepIndex;
	}, function(newValue/* , oldValue */) {
		if (newValue !== undefined) {
			$scope.currentStepIndex = newValue;
		}
	});

	$scope.hasNextStep = function() {
		return !!$scope.lesson && $scope.lesson.steps && $scope.currentStepIndex < $scope.lesson.steps.length;
	};

	$scope.showSteps = function() {
		return $scope.currentStepIndex >= 0;
	};

	$scope.nextStep = function() {
		if ($scope.hasNextStep()) {
			$scope.currentStepIndex++;

		}
	};
	$scope.loaded = true;

});
