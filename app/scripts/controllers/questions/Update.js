'use strict';

angular.module('lergoApp').controller('QuestionsUpdateCtrl', function($scope, QuestionsService, $routeParams, ContinuousSave, $log) {

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
		$scope.quizItem.options.push(answer);
	};

	$scope.updateAnswer = function($event, answer, quizItem) {
		if (quizItem.answer === undefined) {
			quizItem.answer = [];
		}
		var checkbox = $event.target;
		if (checkbox.checked) {
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

	$scope.removeOption = function(index) {
		$scope.quizItem.options.splice(index, 1);
	}

});
