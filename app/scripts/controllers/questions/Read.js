'use strict';

angular.module('lergoApp').controller('QuestionsReadCtrl', function($scope, QuestionsService, $routeParams, ContinuousSave, $log, $compile,LergoClient) {

			var questionId = $routeParams.questionId;

			QuestionsService.getUserQuestionById(questionId).then(function(result) {
				$scope.quizItem = result.data;
				$scope.errorMessage = null;
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
			$scope.answers[quizItem._id] = result.data;
		}, function() {
			$log.error('there was an error checking answer');
				});

			};

	$scope.updateAnswer = function(event, answer, quizItem) {
		$log.info('updating answer', arguments);
		if (quizItem.type === 'multipleChoices') {
			if (quizItem.userAnswer === undefined) {
				quizItem.userAnswer = [];
			}
				var checkbox = $event.target;
					if (checkbox.checked) {
				quizItem.userAnswer.push(answer);
					} else {
				quizItem.userAnswer.splice(quizItem.answer.indexOf(answer), 1);
					}
		} else {
			quizItem.userAnswer = answer;
				}
		$scope.checkAnswer();
			};
		});
