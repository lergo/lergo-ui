'use strict';

angular.module('lergoApp').controller('QuestionsIndexCtrl', function($scope, QuestionsService, LergoClient, $location, $log, FilterService, $rootScope) {
	$scope.isModal = false;
	$scope.ageFilter = function(quizItem) {
		return FilterService.filterByAge(quizItem.age);
	};
	$scope.languageFilter = function(quizItem) {
		return FilterService.filterByLanguage(quizItem.language);
	};
	$scope.subjectFilter = function(quizItem) {
		return FilterService.filterBySubject(quizItem.subject);
	};

	$scope.createNewQuestion = function() {
		QuestionsService.createQuestion({
			'language' : FilterService.getLanguageByLocale($rootScope.lergoLanguage)
		}).then(function(result) {
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
		if (!quizItem.type || !QuestionsService.getTypeById(quizItem.type).answers(quizItem)) {
			return '';
		}
		return QuestionsService.getTypeById(quizItem.type).answers(quizItem);
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		if (checkbox.checked) {
			var filtered = filterItems($scope.items);
			angular.forEach(filtered, function(item) {
				item.selected = true;
			});
		} else {
			angular.forEach($scope.items, function(item) {
				item.selected = false;
			});

		}
	};

	function filterItems(items) {
		var filteredItems = [];
		for ( var i = 0; i < items.length; i++) {
			if (!FilterService.filterByAge(items[i].age)) {
				continue;
			} else if (!FilterService.filterByLanguage(items[i].language)) {
				continue;
			} else if (!FilterService.filterBySubject(items[i].subject)) {
				continue;
			} else {
				filteredItems.push(items[i]);
			}
		}
		return filteredItems;

	}

	$scope.$on('$locationChangeStart', function(event) {
		$rootScope.questionScrollPosition = window.scrollY;
	});
	window.scrollTo( 0,$rootScope.questionScrollPosition);
});
