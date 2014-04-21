'use strict';

angular.module('lergoApp').controller('LessonCtrl', function($scope, $log, LergoClient, $location , $routeParams, ContinuousSave ) {

    var saveLesson = new ContinuousSave( {
        'saveFn' : function( value ){
            return LergoClient.lessons.update(value);
        }
    });


    LergoClient.lessons.getById( $routeParams.lessonId).then( function(result){
        $scope.lesson = result.data;
        $scope.$watch('lesson', saveLesson.onValueChange, true);
    });



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
			type = step.type;
		}
		return 'views/lesson/steps/_' + type + '.html';
	};




});
