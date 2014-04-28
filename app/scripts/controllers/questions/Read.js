'use strict';

angular.module('lergoApp').controller('QuestionsReadCtrl', function($scope, QuestionsService, $routeParams, ContinuousSave, $log) {

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
	$scope.correctAnswer=[];
	$scope.submit=function(answer){
		$log.info('QUIZ :'+$scope.quizItem.answer );
		$log.info('Local :'+answer);
		if(angular.equals($scope.quizItem.answer,answer)){
			$log.info('SUCESS');
		}
		else
		$log.info('FAILED:');
		//TODO : Delete above code and make below call work when backed support is there for check answer
//		QuestionsService.submitAnswer($scope.quizItem,answer).then(function(result) {
//			$scope.result = result.data;
//			$scope.errorMessage = null;
//		}, function(result) {
//			$scope.error = result.data;
//			$scope.errorMessage = 'Error in submitting questions  : ' + result.data.message;
//			$log.error($scope.errorMessage);
//		});

	};
	
	$scope.updateSelection = function($event, answer) {
		  var checkbox = $event.target;
		  if(checkbox.checked){
			  $scope.correctAnswer.push(answer);
		  }
		  else{
			  $scope.correctAnswer.splice($scope.correctAnswer.indexOf(answer), 1);
		  }
			  
		};
	

});
