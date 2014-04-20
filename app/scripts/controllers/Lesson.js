'use strict';

angular.module('lergoApp').controller('LessonCtrl', function($scope, $log, LergoClient, $location , ContinuousSave ) {

    var saveLesson = new ContinuousSave( {
        'saveFn' : function( value ){
            return LergoClient.updateLesson(value);
        }
    });

	$scope.lesson = {
		'name' : 'New Lesson',
		'steps' : []
	};


    $scope.$watch('lesson', saveLesson.onValueChange, true);

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


});
