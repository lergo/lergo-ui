'use strict';

angular.module('lergoApp').controller('QuestionsReadCtrl', function($scope, QuestionsService, $routeParams, ContinuousSave, $log, $compile, LergoClient, $sce, $location) {

	var questionId = $routeParams.questionId;

	QuestionsService.getQuestionById(questionId).then(function(result) {
		$scope.quizItem = result.data;
		$scope.errorMessage = null;

		LergoClient.questions.getPermissions($scope.quizItem._id).then(function(result) {
			$scope.permissions = result.data;
		});

	}, function(result) {
		$scope.error = result.data;
		$scope.errorMessage = 'Error in fetching questions by id : ' + result.data.message;
		$log.error($scope.errorMessage);
	});

	$scope.getQuestionViewTemplate = function() {
		if (!!$scope.quizItem && !!$scope.quizItem.type) {
			var type = QuestionsService.getTypeById($scope.quizItem.type);
			return type.viewTemplate;
		}
		return '';
	};
	$scope.checkAnswer = function() {
		var quizItem = $scope.quizItem;
		LergoClient.questions.checkAnswer(quizItem).then(function(result) {
			$scope.answer = result.data;
		}, function() {
			$log.error('there was an error checking answer');
		});

	};

	$scope.getCorrectAnswers = function(quizItem) {
		if (!quizItem || !quizItem.type || !QuestionsService.getTypeById(quizItem.type).answers(quizItem)) {
			return '';
		}
		return QuestionsService.getTypeById(quizItem.type).answers(quizItem);
	};
	$scope.copyQuestion = function(question) {
		LergoClient.questions.copyQuestion(question._id).then(function(result) {
			$location.path('/user/questions/' + result.data._id + '/update');
		}, function(result) {
			$log.error(result);
		});
	};

	$scope.getAnswer = function() {
		return $scope.answer;
	};

	$scope.canSubmit = function(quizItem) {
		if (!quizItem && !quizItem.type) {
			return false;
		}
		return QuestionsService.getTypeById(quizItem.type).canSubmit(quizItem);
	};
	$scope.getFillIntheBlankSize = function(quizItem, index) {
		if (!quizItem.blanks || !quizItem.blanks.type || quizItem.blanks.type === 'auto') {
			if (!!quizItem.answer[index]) {
				var answer = quizItem.answer[index].split(';');
				var maxLength = 0;
				for ( var i = 0; i < answer.length; i++) {
					if (answer[i].length > maxLength) {
						maxLength = answer[i].length;
					}
				}
				return maxLength * 10 + 20;
			}
		} else if (quizItem.blanks.type === 'custom') {
			quizItem.blanks.size = !!quizItem.blanks.size ? quizItem.blanks.size : 4;
			return quizItem.blanks.size * 10 + 20;

		}
	};

	$scope.enterPressed = function(quizItem) {
		if (!$scope.getAnswer(quizItem) && $scope.canSubmit(quizItem)) {
			$scope.checkAnswer();
		}
	};

});
