'use strict';

angular.module('lergoApp').controller('QuestionsIndexCtrl', function($scope, QuestionsService, LergoClient, $location, $log, FilterService) {
	$scope.isModal = false;
	$scope.filter = {};
	$scope.ageFilter = function(quizItem) {
		return FilterService.filterByAge($scope.filter, quizItem.age);
	};
	$scope.languageFilter = function(quizItem) {
		return FilterService.filterByLanguage($scope.filter, quizItem.language);
	};
	$scope.subjectFilter = function(quizItem) {
		return FilterService.filterBySubject($scope.filter, quizItem.subject);
	};

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

    $scope.copyQuestion = function( question ){
        LergoClient.questions.copyQuestion(question._id).then( function( result ){
            $location.path('/user/questions/' + result.data._id + '/update');
        },
        function( result ){
            $log.error(result);
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

	$scope.getAnswers = function(quizItem) {
		if (!quizItem.type || !QuestionsService.getTypeById(quizItem.type).answers(quizItem)) {
			return '';
		}
		return QuestionsService.getTypeById(quizItem.type).answers(quizItem);
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		if (checkbox.checked) {
			angular.forEach($scope.items, function(item) {
				item.selected = true;
			});
		} else {
			angular.forEach($scope.items, function(item) {
				item.selected = false;
			});

		}
	};
});
