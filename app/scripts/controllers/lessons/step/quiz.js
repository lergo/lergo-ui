'use strict';

angular.module('lergoApp').controller(
		'LessonsStepQuizCtrl',
		function($scope, LergoClient, $log, $routeParams, QuestionsService) {
			$scope.selectedStep = JSON.parse($routeParams.data);
			$scope.questions = {};

			LergoClient.questions.findQuestionsById($scope.selectedStep.quizItems).then(function(result) {

				for ( var i = 0; i < result.data.length; i++) {
					$scope.questions[result.data[i]._id] = result.data[i];
				}
			});

			$scope.getQuestion = function(questionId) {
				return $scope.questions[questionId];
			};
			$scope.getQuizItemTemplate = function(id) {
				return LergoClient.questions.getTypeById($scope.getQuestion(id).type).viewTemplate;
			};

			$scope.correctAnswers = {};
			$scope.submit = function() {
				QuestionsService.submitAnswers($scope.correctAnswers).then(function(result) {
					$scope.result = result.data;
					$scope.errorMessage = null;
				}, function(result) {
					$scope.error = result.data;
					$scope.errorMessage = 'Error in submitting questions : ' + result.data.message;
					$log.error($scope.errorMessage);
				});

			};

			$scope.updateAnswer = function($event, answer, quizItem) {
				var checkbox = $event.target;
				var correctAnswer = $scope.correctAnswers[quizItem._id];
				if (correctAnswer === undefined) {
					correctAnswer = [];
					$scope.correctAnswers[quizItem._id] = correctAnswer;
				}
				if (QuestionsService.getTypeById(quizItem.type).id === 'multipleChoicesMultipleAnswers') {
					if (checkbox.checked) {
						correctAnswer.push(answer);
					} else {
						correctAnswer.splice(correctAnswer.indexOf(answer), 1);
					}
				} else if (QuestionsService.getTypeById(quizItem.type).id === 'multipleChoiceSingleAnswer'
						|| QuestionsService.getTypeById(quizItem.type).id === 'trueFalse'
						|| QuestionsService.getTypeById(quizItem.type).id === 'exactMatch') {
					correctAnswer.splice(0, correctAnswer.length);
					correctAnswer.push(answer);
				}

			};
			$scope.fillInTheBlanks = function(quizItem) {
				var question = quizItem.question;
				var res = quizItem.question;
				$scope.correctAnswers[quizItem._id] = [];
				var re = /\[(.*?)\]/g;
				var i = 0;
				for ( var m = re.exec(question); m; m = re.exec(question)) {
					res = res.replace('[' + m[1] + ']', '<input ng-model= correctAnswers[quizItem._id][' + i + '] />');
					i = i + 1;
				}
				return '<div>' + res + '<\div>';
			};
		});
