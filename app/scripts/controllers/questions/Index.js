'use strict';

angular.module('lergoApp').controller('QuestionsIndexCtrl', function($scope, QuestionsService, LergoClient, TagsService, $location, $log, FilterService, $rootScope) {
	$scope.isModal = false;

    $scope.totalResults = 0;
    $scope.questionsFilter = {  };
    $scope.filterPage = { };
    $scope.questionsFilterOpts = {
        'showSubject' : true,
        'showLanguage' : true,
        'showAge' : true
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


    $scope.loadQuestions = function() {
        var queryObj = { 'filter' : _.merge({}, $scope.questionsFilter), 'sort' : { 'lastUpdate' : -1 }, 'dollar_page' : $scope.filterPage };

        var getQuestionsPromise = null;
        if (!$scope.isPublic) {
            getQuestionsPromise = QuestionsService.getUserQuestions( queryObj );
        } else {
            getQuestionsPromise = QuestionsService.getPublicQuestions( queryObj );
        }

        getQuestionsPromise.then(function (result) {
            $scope.items = result.data.data;
            $scope.errorMessage = null;
            $scope.totalResults = result.data.total;
            $scope.filterPage.count = result.data.count;
        }, function (result) {
            $scope.error = result.data;
            $scope.errorMessage = 'Error in fetching questions : ' + result.data.message;
            $log.error($scope.errorMessage);
        });
    };


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


	$scope.$on('$locationChangeStart', function() {
		$rootScope.questionScrollPosition = window.scrollY;
	});

	if (!!$rootScope.questionScrollPosition) {
		window.scrollTo(0, $rootScope.questionScrollPosition);
	}
});
