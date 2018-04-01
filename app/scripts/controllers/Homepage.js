'use strict';

angular.module('lergoApp').controller('HomepageCtrl', function($scope, LergoClient, TagsService, $rootScope, $filter, $log, $routeParams, $location,  $window) {

    $scope.scrollToTop = function() {
        document.body.scrollTop = 0;
    };

	$scope.loaded = false;
	$scope.lessonsFilter = {
		'public' : {
			'dollar_exists' : 1
		}
	};
	$scope.filterPage = {};
	$scope.lessonsFilterOpts = {
        'showSubject': true,
        'showLanguage': true,
        'showAge': true,
        'showViews': true,
        'showTags': true,
        'showCreatedBy': true
	};

	$scope.thisRoute = $routeParams.search;

	$scope.loadLessons = function() {

		$log.info('loading lessons');

		var searchFilter = {};
		if (!!$routeParams.search) {
			searchFilter = {
				'searchText' : $routeParams.search
			};
		}

        $scope.hasQuestions = function(lesson){
            return LergoClient.lessons.countQuestions(lesson) > 0;
        };

		var queryObj = {
			'filter' : _.merge(searchFilter, $scope.lessonsFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		LergoClient.lessons.getPublicLessons(queryObj).then(function(result) {
			$scope.lessons = result.data.data;
			$scope.filterPage.count = result.data.count; // the number of
			// lessons found
			// after filtering
			// them.
			scrollToPersistPosition();
			$scope.loaded = true;
		});

	};

    var translate = $filter('translate');
	$scope.$watch(function() {
		return translate('lergo.title');
	}, function() {
		$rootScope.page = {
			'title' : translate('lergo.title'),
			'description' : translate('lergo.description')
		};
	});

	$scope.absoluteShareLink = function(lesson) {
		return window.location.origin + '/#!/public/lessons/' + lesson._id + '/share';
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
