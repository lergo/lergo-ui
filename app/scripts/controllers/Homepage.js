'use strict';

angular.module('lergoApp').controller('HomepageCtrl', function($scope, LergoClient, TagsService, FilterService, $rootScope, $filter, $log, $routeParams ) {


    $scope.lessonsFilter = { 'public' : { 'dollar_exists' : 1 } };
    $scope.filterPage = { };
    $scope.lessonsFilterOpts = {
        'showSubject' : true,
        'showLanguage' : true,
        'showAge' : true,
        'showViews': true,
        'showTags' : true,
        'showCreatedBy':true
    };

    $scope.loadLessons = function() {
        $log.info('loading lessons');

        var searchFilter = {};
        if ( !!$routeParams.search ){
            searchFilter = { 'searchText' : $routeParams.search };
        }

        var queryObj =  { 'filter' : _.merge(searchFilter, $scope.lessonsFilter), 'sort' : { 'lastUpdate' : -1 }, 'dollar_page' : $scope.filterPage };
        LergoClient.lessons.getPublicLessons( queryObj ).then(function (result) {
            $scope.lessons = result.data.data;
            $scope.filterPage.count = result.data.count; // the number of lessons found after filtering them.
        });
    };

	$scope.$watch(function() {
		return $filter('i18n')('lergo.title');
	}, function() {
		$rootScope.page = {
			'title' : $filter('i18n')('lergo.title'),
			'description' : $filter('i18n')('lergo.description')
		};
	});


	$scope.absoluteShareLink = function(lesson) {
		return window.location.origin + '/#!/public/lessons/' + lesson._id + '/share';
	};

});
