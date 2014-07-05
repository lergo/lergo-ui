'use strict';

angular.module('lergoApp').controller('AdminHomepageCtrl', function($scope, AdminClientService, FilterService, LergoClient, $log) {

	AdminClientService.lessons.getLessons().then(function(result) {
		$scope.lessons = result.data;
		
	});

	var users = {};

	AdminClientService.getAllUsers().then(function(result) {
		result.data.forEach(function(user) {
			users[user._id] = user;
		});
	});

	$scope.ageFilter = function(lesson) {
		return FilterService.filterByAge(lesson.age);
	};
	$scope.languageFilter = function(lesson) {
		return FilterService.filterByLanguage(lesson.language);
	};
	$scope.subjectFilter = function(lesson) {
		return FilterService.filterBySubject(lesson.subject);
	};

	$scope.getUser = function(lesson) {
		return users[lesson.userId];
	};

	$scope.changing = [];
	var changing = $scope.changing;

	function save(lesson) {
		changing.push(lesson._id);
		AdminClientService.lessons.update(lesson).then(function success(result) {
			var indexOf = $scope.lessons.indexOf(lesson);
			$scope.lessons[indexOf] = result.data;
			changing.splice(changing.indexOf(lesson._id), 1);
		}, function error() {
			changing.splice(changing.indexOf(lesson._id), 1);
		});
	}

	$scope.makePublic = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				lesson.public = new Date().getTime();
				delete lesson.selected;
				save(lesson);
			}
		});
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		if (checkbox.checked) {
			var filtered = filterItems($scope.lessons);
			angular.forEach(filtered, function(item) {
				item.selected = true;
			});
		} else {
			angular.forEach($scope.lessons, function(item) {
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

	$scope.makePrivate = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				delete lesson.public;
				delete lesson.selected;
				save(lesson);
			}
		});
	};

	$scope.deleteLesson = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				LergoClient.lessons.delete(lesson._id).then(function() {
					$scope.errorMessage = null;
					$log.info('Lesson deleted sucessfully');
				}, function(result) {
					$scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
			}
		});
	};

	$scope.isChanging = function(lesson) {
		return changing.indexOf(lesson._id) >= 0;
	};

	$scope.getPublicLessonCount = function() {
		var count = 0;
		angular.forEach($scope.lessons, function(lesson) {
			if (!!lesson.public) {
				count = count+ 1;
			}
		});
		return count;

	};
});
