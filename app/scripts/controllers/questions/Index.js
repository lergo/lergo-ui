'use strict';

angular.module('lergoApp').controller('QuestionsIndexCtrl', function($scope, QuestionsService, $location) {

	$scope.createNewQuestion = function() {
		QuestionsService.createQuestion().then(function(result) {
			$scope.errorMessage = null;
			$location.path('/user/questions/' + result.data._id + '/update');
		}, function(result) {
			$scope.error = result.data;
			$scope.errorMessage = 'Error in creating questions : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};

	QuestionsService.getUserQuestions().then(function(result) {
		$scope.items = result.data;
		$scope.errorMessage = null;
	}, function(result) {
		$scope.error = result.data;
		$scope.errorMessage = 'Error in fetching questions : ' + result.data.message;
		$log.error($scope.errorMessage);
	});
});
