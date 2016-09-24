'use strict';

angular.module('lergoApp').controller('LessonsDisplayCtrl',
    function($scope, $routeParams, LergoClient, ReportsService, $log, $controller, $rootScope, $location, shuffleQuestionsFilter, $window, $route ,$timeout) {

	// guy - using this flag because ng-cloak and other solutions will not apply
	// to this scenario.
	// the display to the lesson is simply taking time, because we have to fetch
	// the lesson and the report
	// so once they are loaded, we will switch that flag to true.
	// otherwise we get a flash of the last screen (LERGO-358).
	$scope.loaded = false;
	$window.scrollTo(0, 0);
	$controller('LessonsStepDisplayCtrl', {
		$scope : $scope
	});

    if ( $route && $route.current && $route.current.$$route && $route.current.$$route.params &&  $route.current.$$route.params.preview ){
        LergoClient.lessons.getById( $routeParams.lessonId).then(function(result){
            $scope.lesson = result.data;
        }, function(){
            toastr.error('failed loading lesson', 'error');
        });
    }

	$scope.currentStepIndex = parseInt($routeParams.currentStepIndex || 0, 10);
	$log.info('current step index', $scope.currentStepIndex);

    // for quiz steps, we also put "answers" on the scope in case user refreshes the page etc.
    function updateQuestionsAnswers(){
        if ( !!$scope.step && !!$scope.step.quizItems && $scope.answers ){

            if ( !!$scope.report && !isNaN(parseInt($scope.currentStepIndex,10))  ){
                $scope.answers = ReportsService.getAnswersByQuizItemId( $scope.report, parseInt($scope.currentStepIndex,10) );
            }
        }
    }



	// will update step on scope
	function updateCurrentStep() {
		if ($scope.currentStepIndex >= 0) {
			if (!!$scope.lesson) {

                $scope.step = $scope.lesson.steps[$scope.currentStepIndex];
                updateQuestionsAnswers();

				if (!!$scope.step) {
					shuffleQuestionsFilter( { 'array' : $scope.step.quizItems, 'disabled' : !$scope.step.shuffleQuestion , 'report' : $scope.report , 'stepIndex' : $scope.currentStepIndex } );
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
        if ( !!$scope.lesson ) {
            $log.info('currentStepIndex changed', newValue, oldValue);
            updateCurrentStep();

            // in case of temporary lesson we don't want to remember history
            // conversion ~~ to support string and numbers
            if (!!$scope.lesson.temporary || parseInt(newValue + '',10) === 0 ) { // temporary means "create lesson from mistakes" and such..
                $location.search('currentStepIndex', newValue).replace();
            } else {
                $location.search('currentStepIndex', newValue);
            }
            $rootScope.$broadcast('stepIndexChange', {
                'old': oldValue,
                'new': newValue
            });
        }
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
        $scope.continueBtnDisable = true;
		if ($scope.hasNextStep()) {
			$scope.currentStepIndex++;
		}
		// avoiding clicking more then once
		$timeout(function(){
            $scope.continueBtnDisable = false;
        },1000);

	};
	$scope.loaded = true;


});
