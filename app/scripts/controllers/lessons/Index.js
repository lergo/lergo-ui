'use strict';

angular.module('lergoApp').controller('LessonsIndexCtrl', function($scope, $log, LergoClient, $location, $rootScope) {

    $scope.lessonsFilter = {  };
    $scope.filterPage = { };
    $scope.totalResults = 0;
    $scope.lessonsFilterOpts = {
        'showSubject' : true,
        'showLanguage' : true,
        'showAge' : true,
        'showViews': true,
        'showTags' : true
    };

    $scope.loadLessons = function() {
        $log.info('loading lessons');
        var queryObj =  { 'filter' : _.merge({}, $scope.lessonsFilter), 'dollar_page' : $scope.filterPage };

        LergoClient.userData.getLessons( queryObj ).then(function(result) {
            $scope.lessons = result.data.data;
            $scope.filterPage.count = result.data.count; // number of lessons after filtering .. changing pagination.
            $scope.totalResults = result.data.total;
            $scope.errorMessage = null;
            $log.info('Lesson fetched successfully');
        }, function(result) {
            $scope.errorMessage = 'Error in fetching Lessons : ' + result.data.message;
            $log.error($scope.errorMessage);
        });
    };


	$scope.create = function() {
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			$scope.errorMessage = null;
			$location.path('/user/lesson/' + lesson._id + '/update');
		}, function(result) {
			$scope.errorMessage = 'Error in creating Lesson : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};
	$scope.$on('$locationChangeStart', function() {
		$rootScope.lessonScrollPosition = window.scrollY;
	});
	window.scrollTo(0, $rootScope.lessonScrollPosition);
});
