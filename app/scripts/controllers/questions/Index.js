'use strict';

angular.module('lergoApp').controller('QuestionsIndexCtrl', function($scope, QuestionsService, LergoClient, TagsService, $location, $log, localStorageService, FilterService, $rootScope, $window) {
	// enum
	$scope.QuestionTypeToLoad = {
		all : 'allQuestions',
		user : 'myQuestions',
		liked : 'likedQuestions'
	};

	$scope.totalResults = 0;
	$scope.questionsFilter = {};
	$scope.filterPage = {};
	$scope.questionsFilterOpts = {
		showSubject : true,
		showLanguage : true,
		showAge : true,
		showSearchText : true,
		showTags : true,
		showCreatedBy : localStorageService.get('questionTypeToLoad') === $scope.QuestionTypeToLoad.all
	};

	$scope.selectAll = function(checked) {
		_.each($scope.items, function(item) {
			item.selected = checked;
		});
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

	$scope.$watch('questionTypeFormAddQuizPopup', function(newValue) {
		if (!!newValue) {
			$scope.load(newValue.value);
		}
	}, true);
	$scope.load = function(questionTypeToLoad) {
		var oldValue = localStorageService.get('questionTypeToLoad');
		if (oldValue !== questionTypeToLoad) {
			$scope.questionsFilterOpts.showCreatedBy = questionTypeToLoad === $scope.QuestionTypeToLoad.all;
			localStorageService.set('questionTypeToLoad', questionTypeToLoad);
			$scope.filterPage.current = 1;
			$scope.filterPage.updatedLast = new Date().getTime();
		}
	};

	$scope.loadQuestions = function() {
		$scope.questionToLoad = localStorageService.get('questionTypeToLoad');
		var queryObj = {
			'filter' : _.merge({}, $scope.questionsFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		var getQuestionsPromise = null;
		if ($scope.questionToLoad === $scope.QuestionTypeToLoad.all) {
			getQuestionsPromise = QuestionsService.getPublicQuestions(queryObj);
		} else if ($scope.questionToLoad === $scope.QuestionTypeToLoad.liked) {
			getQuestionsPromise = LergoClient.userData.getLikedQuestions(queryObj);
		} else {
			getQuestionsPromise = LergoClient.userData.getQuestions(queryObj);
			$scope.questionToLoad = $scope.QuestionTypeToLoad.user;
		}

		getQuestionsPromise.then(function(result) {
			$scope.items = result.data.data;
			$rootScope.$broadcast('questionsLoaded', {
				'items' : $scope.items
			});
			$scope.errorMessage = null;
			$scope.totalResults = result.data.total;
			$scope.filterPage.count = result.data.count;
			updateUserInfo($scope.items);
		}, function(result) {
			$scope.error = result.data;
			$scope.errorMessage = 'Error in fetching questions : ' + result.data.message;
			$log.error($scope.errorMessage);
		});

		scrollToPersistPosition();
	};

	function updateUserInfo(questions) {
		var users = _.uniq(_.compact(_.map(questions, 'userId')));

		// get all users we copied from..
		LergoClient.users.findUsersById(users).then(function(result) {
			// turn list of users to map where id is map
			var usersById = _.indexBy(result.data, '_id');

			_.each(questions, function(q) {
				q.user = usersById[q.userId];
			});

			$scope.items = questions;
		});
	}

	$scope.getAnswers = function(quizItem) {
		if (!quizItem.type) {
			return '';
		}
		var type = QuestionsService.getTypeById(quizItem.type);
		if (!type || !type.answers(quizItem)) {
			return '';
		}
		return type.answers(quizItem);
	};

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
