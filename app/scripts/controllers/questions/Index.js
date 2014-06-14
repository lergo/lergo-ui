'use strict';

angular.module('lergoApp').controller('QuestionsIndexCtrl', function($scope, QuestionsService, $location, $log, FilterService) {
	$scope.isModal = false;
	$scope.subjects = FilterService.subjects;
	$scope.languages = FilterService.languages;
	$scope.ageRanges = FilterService.ageRanges;
	$scope.filter = {};

	$scope.ageFilter = function(quizItem) {
		if (!$scope.filter.age) {
			return true;
		}
		return FilterService.filterByAge($scope.filter.age, quizItem.age);
	};
	$scope.languageFilter = function(quizItem) {
		if (!$scope.filter.language) {
			return true;
		}
		return quizItem.language === $scope.filter.language;
	};
	$scope.subjectFilter = function(quizItem) {
		if (!$scope.filter.subject) {
			return true;
		}
		return quizItem.subject === $scope.filter.subject;
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

	QuestionsService.getUserQuestions().then(function(result) {
		$scope.items = result.data;
		$scope.errorMessage = null;
	}, function(result) {
		$scope.error = result.data;
		$scope.errorMessage = 'Error in fetching questions : ' + result.data.message;
		$log.error($scope.errorMessage);
	});

	$scope.getAnswers = function(quizItem) {
		var answers = [];
		if (!quizItem.type || !QuestionsService.getTypeById(quizItem.type).answers(quizItem)) {
			return answers;
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
