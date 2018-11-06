'use strict';

angular.module('lergoApp').controller('LessonsPlaylistindexCtrl', function($scope, LessonsService, LergoClient, TagsService, $location, $log, localStorageService, $rootScope, $window, LergoTranslate) {
	// enum
	$scope.LessonTypeToLoad = {
		all : 'allLessons',
		user : 'myLessons',
		liked : 'likedLessons'
	};

	$scope.totalResults = 0;
	$scope.lessonsFilter = {};
	$scope.filterPage = {};
	$scope.lessonsFilterOpts = {
		showSubject : true,
		showLanguage : true,
		showAge : true,
		showSearchText : true,
		showTags : true,
		showCreatedBy : localStorageService.get('lessonTypeToLoad') === $scope.LessonTypeToLoad.all
	};

    $scope.selectAll = function(event) {
        var checkbox = event.target;
		_.each($scope.items, function(item) {
			item.selected = checkbox.checked;
		});
	};

	$scope.createNewLesson = function() {
        $scope.createLessonBtnDisable=true;
		LessonsService.createLesson({
			'language' : LergoTranslate.getLanguageObject().name
		}).then(function(result) {
			$scope.errorMessage = null;
			$location.path('/user/lessons/' + result.data._id + '/update');
		}, function(result) {
			$scope.error = result.data;
			$scope.errorMessage = 'Error in creating lessons : ' + result.data.message;
			$log.error($scope.errorMessage);
            $scope.createLessonBtnDisable=false;
		});
	};

	$scope.$watch('lessonTypeFormAddQuizPopup', function(newValue) {
		if (!!newValue) {
			$scope.load(newValue.value);
		}
	}, true);
	$scope.load = function(lessonTypeToLoad) {
		var oldValue = localStorageService.get('lessonTypeToLoad');
		if (oldValue !== lessonTypeToLoad) {
			$scope.lessonsFilterOpts.showCreatedBy = lessonTypeToLoad === $scope.LessonTypeToLoad.all;
			localStorageService.set('lessonTypeToLoad', lessonTypeToLoad);
			$scope.filterPage.current = 1;
			$scope.filterPage.updatedLast = new Date().getTime();
		}
	};

	$scope.loadLessons = function() {
		$scope.lessonToLoad = localStorageService.get('lessonTypeToLoad');
		var queryObj = {
			'filter' : _.merge({}, $scope.lessonsFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		var getLessonsPromise = null;
		if ($scope.lessonToLoad === $scope.LessonTypeToLoad.all) {
            var pubFilter = { 'filter' : {'public' : {'dollar_exists' : 1}}};
            _.merge(queryObj, pubFilter);
			getLessonsPromise = LessonsService.getPublicLessons(queryObj);
		} else if ($scope.lessonToLoad === $scope.LessonTypeToLoad.liked) {
			getLessonsPromise = LergoClient.userData.getLikedLessons(queryObj);
		} else {
			getLessonsPromise = LergoClient.userData.getLessons(queryObj);
			$scope.lessonToLoad = $scope.LessonTypeToLoad.user;
		}

		getLessonsPromise.then(function(result) {
			$scope.items = result.data.data;
			$rootScope.$broadcast('lessonsLoaded', {
				'items' : $scope.items
			});
			$scope.errorMessage = null;
			$scope.totalResults = result.data.total;
			$scope.filterPage.count = result.data.count;
			updateUserInfo($scope.items);
		}, function(result) {
			$scope.error = result.data;
			$scope.errorMessage = 'Error in fetching lessons : ' + result.data.message;
			$log.error($scope.errorMessage);
		});

		scrollToPersistPosition();
	};

	function updateUserInfo(lessons) {
		var users = _.uniq(_.compact(_.map(lessons, 'userId')));

		// get all users we copied from..
		LergoClient.users.findUsersById(users).then(function(result) {
			// turn list of users to map where id is map
			var usersById = _.keyBy(result.data, '_id');

			_.each(lessons, function(q) {
				q.user = usersById[q.userId];
			});

			$scope.items = lessons;
		});
	}

	/*$scope.getAnswers = function(quizItem) {
		if (!quizItem.type) {
			return '';
		}
		var type = LessonsService.getTypeById(quizItem.type);
		if (!type || !type.answers(quizItem)) {
			return '';
		}
		return type.answers(quizItem);
	};*/

	var path = $location.path();
	$scope.$on('$locationChangeStart', function() {
		persistScroll($scope.filterPage.current);
	});

	$scope.$watch('filterPage.current', function(newValue, oldValue) {
		if (!!oldValue) {

			persistScroll(oldValue);
		}
	});
	function persistScroll(pageNumber) {
		if (!$rootScope.scrollPosition) {
			$rootScope.scrollPosition = {};
		}
		$rootScope.scrollPosition[path + ':page:' + pageNumber] = $window.scrollY;
	}
	function scrollToPersistPosition() {
		var scrollY = 0;
		if (!!$rootScope.scrollPosition) {
			scrollY = $rootScope.scrollPosition[path + ':page:' + $scope.filterPage.current] || 0;
		}
		$window.scrollTo(0, scrollY);
	}
});
