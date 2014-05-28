'use strict';

angular.module('lergoApp').controller('QuestionsUpdateCtrl', function($scope, QuestionsService, $routeParams, ContinuousSave, $log, $location) {

	var saveQuestion = new ContinuousSave({
		'saveFn' : function(value) {
			return QuestionsService.updateQuestion(value);
		}
	});

	$scope.saveQuestion = saveQuestion;

	var questionId = $routeParams.questionId;

	$scope.types = QuestionsService.questionsType;

	QuestionsService.getUserQuestionById(questionId).then(function(result) {
		$scope.quizItem = result.data;
		$scope.errorMessage = null;
	}, function(result) {
		$scope.error = result.data;
		$scope.errorMessage = 'Error in fetching questions by id : ' + result.data.message;
		$log.error($scope.errorMessage);
	});

	$scope.$watch('quizItem', saveQuestion.onValueChange, true);

	// setInterval( function(){ console.log($scope.quizItem)}, 1000);

	$scope.getQuestionUpdateTemplate = function() {
		if (!!$scope.quizItem && !!$scope.quizItem.type) {
			var type = QuestionsService.getTypeById($scope.quizItem.type);
			return type.updateTemplate;
		}
		return '';
	};
	$scope.newAnswer = 'New Answer';
	$scope.addOption = function(answer) {
		if ($scope.quizItem.options === undefined) {
			$scope.quizItem.options = [];
		}
		if ($scope.quizItem.options.indexOf(answer) < 0) {
			$scope.quizItem.options.push(answer);
		}

	};
	$scope.addOption = function() {
		if ($scope.quizItem.options === undefined) {
			$scope.quizItem.options = [];
		}
		var newOption = 'Answer Option' + ($scope.quizItem.options.length + 1);
		$scope.quizItem.options.push(newOption);
		if ($scope.quizItem.type === 'exactMatch') {
			$scope.quizItem.answer = $scope.quizItem.options;
		}
	};
	$scope.updateAnswer = function($event, answer, quizItem) {
		if (quizItem.answer === undefined) {
			quizItem.answer = [];
		}
		var checkbox = $event.target;
		if (checkbox.checked) {
			if (quizItem.type === 'trueFalse' || quizItem.type === 'multipleChoiceSingleAnswer') {
				quizItem.answer = [];
			}
			quizItem.answer.push(answer);
		} else {
			quizItem.answer.splice(quizItem.answer.indexOf(answer), 1);
		}
	};
	$scope.isCorrectAnswer = function(answer, quizItem) {
		if (quizItem.answer === undefined) {
			return false;
		}
		return quizItem.answer.indexOf(answer) > -1;
	};
	$scope.generateFillInTheBlanks = function() {
		var question = $scope.quizItem.question;
		var res = $scope.quizItem.question;
		var re = /\[(.*?)\]/g;
		var answer = [];
		for ( var m = re.exec(question); m; m = re.exec(question)) {
			answer.push(m[1].split(","));
		}
		$scope.quizItem.answer = answer;
	};

	$scope.removeOption = function(option) {
		$scope.quizItem.options.splice($scope.quizItem.options.indexOf(option), 1);
		if ($scope.quizItem.answer !== undefined) {
			$scope.quizItem.answer.splice($scope.quizItem.answer.indexOf(option), 1);
		}
	}

	$scope.isSaving = function() {
		return !!saveQuestion.getStatus().saving;
	};

	$scope.done = function() {
		$location.path('/user/questions');
	};

});
