'use strict';

angular.module('lergoApp').controller('AdminLessonIndexCtrl', function($scope, LergoClient, $log, $filter) {

	$scope.adminFilter = {};
	$scope.filterPage = {};

	$scope.adminFilterOpts = {
        'showLimitedSubject' : true,
        'showHasQuestions' : true,
		'showLessonStatus' : true,
		'showLimitedLanguage' : true,
		'showLimitedAge' : true,
		'showViews' : true,
		'showTags' : true,
		'showCreatedBy' : true,
		'showSearchText' : true
	};

    var defaultFilter = {};
    LergoClient.users.getUserPermissions().then(function( permissions ){
        if ( permissions && permissions.limitations && permissions.limitations.editOnlyUnpublishedContent ){
            defaultFilter.public = { $exists : false } ;
        }
    });

	$scope.loadLessons = function() {

		var queryObj = {
			'filter' : _.merge( defaultFilter, $scope.adminFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		LergoClient.lessons.getAll(queryObj).then(function(result) {
			$scope.lessons = result.data.data;
			$scope.filterPage.count = result.data.count; // the number of
			// lessons found
			// after filtering
			// them.
		});
	};

	function loadStats() {
		$scope.updateStats(true);
	}

	var users = {};

	$scope.$watch('lessons', function() {
		var requiredUsers = _.difference(_.map($scope.lessons, 'userId'), _.map(users, '_id'));

		if (requiredUsers.length > 0) {
			LergoClient.users.findUsersById(requiredUsers).then(function(result) {
				result.data.forEach(function(user) {
					users[user._id] = user;
				});
			});
		}
	});

	$scope.getUser = function(lesson) {
		return users[lesson.userId];
	};

	$scope.changing = [];
	var changing = $scope.changing;

	function save(lesson) {
		// preserving selected state of lesson
		var selected = lesson.selected;
		delete lesson.selected;
		changing.push(lesson._id);
		LergoClient.lessons.update(lesson).then(function success(result) {
			var indexOf = $scope.lessons.indexOf(lesson);
			result.data.selected = selected;
			$scope.lessons[indexOf] = result.data;
			changing.splice(changing.indexOf(lesson._id), 1);
			loadStats();
			$scope.loadLessons();
		}, function error() {
			changing.splice(changing.indexOf(lesson._id), 1);
		});
	}

	$scope.makePublic = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				lesson.public = new Date().getTime();
				save(lesson);
			}
		});
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		angular.forEach($scope.lessons, function(item) {
			item.selected = checkbox.checked;
		});
	};

	$scope.makePrivate = function() {
		angular.forEach($scope.lessons, function(lesson) {
			if (lesson.selected === true) {
				delete lesson.public;
				save(lesson);
			}
		});
	};

	$scope.deleteLesson = function() {
		if (confirm($filter('translate')('deleteLessons.Confirm'))) {
			angular.forEach($scope.lessons, function(lesson) {
				if (lesson.selected === true) {
					$scope.lessons.splice($scope.lessons.indexOf(lesson), 1);
					LergoClient.lessons.delete(lesson._id).then(function() {
						$scope.errorMessage = null;
						$log.info('Lesson deleted sucessfully');
					}, function(result) {
						$scope.errorMessage = 'Error in deleting Lesson : ' + result.data.message;
						$log.error($scope.errorMessage);
					});
				}
			});
		}
	};

	$scope.isChanging = function(lesson) {
		return changing.indexOf(lesson._id) >= 0;
	};

});
