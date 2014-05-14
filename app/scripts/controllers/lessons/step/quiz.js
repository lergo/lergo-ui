'use strict';

angular.module('lergoApp')
  .controller('LessonsStepQuizCtrl', function ($scope,LergoClient,$log) {
	  $scope.selectedStep = LergoClient.lessons.selectedStep;
	  $scope.getQuizItemTemplate = function(id) {
		  LergoClient.questions.getUserQuestionById(id).then(function(result) {
				$scope.quizItem = result.data;
				$scope.errorMessage = null;
				return LergoClient.questions.getTypeById(quizItem.question.type).viewTemplate;
			}, function(result) {
				$scope.error = result.data;
				$scope.errorMessage = 'Error in fetching questions by id : ' + result.data.message;
				$log.error($scope.errorMessage);
				return;
			});
		};
  });
