'use strict';

angular.module('lergoApp').controller(
		'QuestionsReadCtrl',
		function($scope, QuestionsService, $routeParams, ContinuousSave, $log, $compile) {

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

			$scope.getQuestionViewTemplate = function() {
				if (!!$scope.quizItem && !!$scope.quizItem.type) {
					var type = QuestionsService.getTypeById($scope.quizItem.type);
					return type.viewTemplate;
				}
				return '';
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

			$scope.fillInTheBlanks = function() {
				var question = $scope.quizItem.question;
				var res = $scope.quizItem.question;
				var re = /\[(.*?)\]/g;
				var i = 0;
				for ( var m = re.exec(question); m; m = re.exec(question)) {
					$scope.correctAnswers[i] = 'wow';
					res = res.replace('[' + m[1] + ']', '<input  type="text"  ng-model= "correctAnswer[' + i + ']" />');
					i = i + 1;
				}
				return res;
			};
		});
