'use strict';

angular.module('lergoApp').controller('HomepageCtrl', function($scope, LergoClient, TagsService, FilterService, $rootScope, $filter) {
	$scope.$watch(function() {
		return $filter('i18n')('lergo.title');
	}, function() {
		$rootScope.page = {
			'title' : $filter('i18n')('lergo.title'),
			'description' : $filter('i18n')('lergo.description')
		};
	});
	$scope.numOfItemsInPage = 18;
	$scope.initPageLessons = function(currentPage) {
		if (!!$scope.lessons) {
			filterItems();
			var startIndex = (currentPage - 1) * $scope.numOfItemsInPage;
			var endIndex = Math.min(startIndex + $scope.numOfItemsInPage, $scope.filteredLessons.length);
			$scope.pageLessons = $scope.filteredLessons.slice(startIndex, endIndex);
		}
	};

	LergoClient.lessons.getPublicLessons().then(function(result) {
		$scope.lessons = result.data;
		$scope.availableTags = TagsService.getTagsFromItems($scope.lessons);

		$scope.lessons.forEach(function(value) {
			value.image = LergoClient.lessons.getTitleImage(value);
		});
		$scope.initPageLessons(1);
	});

	$scope.ageFilter = function(lesson) {
		filterItems();
		return FilterService.filterByAge(lesson.age);
	};

	$scope.tagsFilter = function(lesson) {
		return FilterService.filterByTags(lesson.tags);
	};

	$scope.languageFilter = function(lesson) {
		return FilterService.filterByLanguage(lesson.language);
	};
	$scope.subjectFilter = function(lesson) {
		return FilterService.filterBySubject(lesson.subject);
	};
	$scope.viewsFilter = function(lesson) {
		return FilterService.filterByViews(lesson.views);
	};
	$scope.userFilter = function(lesson) {
		return FilterService.filterByUser(lesson.user.username);
	};
	LergoClient.lessons.getStats().then(function(result) {
		$scope.stats = result.data;
	});

	$scope.absoluteShareLink = function(lesson) {
		return window.location.origin + '/#!/public/lessons/' + lesson._id + '/share';
	};

	function filterItems() {
		var items = $scope.lessons;
		$scope.filteredLessons = [];
		for ( var i = 0; i < items.length; i++) {
			if (!FilterService.filterByAge(items[i].age)) {
				continue;
			} else if (!FilterService.filterByLanguage(items[i].language)) {
				continue;
			} else if (!FilterService.filterBySubject(items[i].subject)) {
				continue;
			} else if (!FilterService.filterByViews(items[i].views)) {
				continue;
			} else if (!FilterService.filterByUser(items[i].user.username)) {
				continue;
			} else if (!FilterService.filterByTags(items[i].tags)) {
				continue;
			} else {
				$scope.filteredLessons.push(items[i]);
			}
			
			$scope.filteredLessons= _.sortBy($scope.filteredLessons, 'lastUpdated');
		}

	}

});
