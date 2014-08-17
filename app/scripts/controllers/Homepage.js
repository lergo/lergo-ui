'use strict';

angular.module('lergoApp').controller('HomepageCtrl', function($scope, LergoClient, TagsService, FilterService, $rootScope, $filter/*
																									 * ,
																									 * $location,
																									 * $log
																									 */) {



    $scope.$watch( function(){
        return $filter('i18n')('lergo.title');
    }, function(){
        $rootScope.page = {
            'title' : $filter('i18n')('lergo.title'),
            'description' : $filter('i18n')('lergo.description')
        };
    });

	LergoClient.lessons.getPublicLessons().then(function(result) {
		$scope.lessons = result.data;
        $scope.availableTags = TagsService.getTagsFromItems( $scope.lessons );

		$scope.lessons.forEach(function(value) {
			value.image = LergoClient.lessons.getTitleImage(value);
		});
	});

	$scope.ageFilter = function(lesson) {
		return FilterService.filterByAge(lesson.age);
	};

    $scope.tagsFilter = function(lesson){
        return FilterService.filterByTags( lesson.tags );
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
	LergoClient.lessons.getStats().then(function(result) {
		$scope.stats = result.data;
	});

	$scope.absoluteShareLink = function(lesson) {
		return window.location.origin + '/#!/public/lessons/' + lesson._id + '/share';
	};

	/** * MOCK CODE FOR REFERENCE - WILL BE REMOVED BY END OF JUNE ** */
	/*
	 * $scope.filters = [ { 'label' : 'age range',
	 * 'options':['1-6','6-10','10-15','15-20','Custom'], 'select':null}, {
	 * 'label' : 'language',
	 * 'options':['languages.en','languages.he','languages.ru'],
	 * 'translate':true, 'select':null}, { 'label' : 'subject',
	 * 'options':['subject.spelling','subject.math','subject.art'],
	 * 'translate':true, 'select':null} ];
	 * 
	 * $scope.tags = [ 'confusing words', 'tricks', 'visual', 'fun' ]; // true ==
	 * next, false == prev $scope.flipSection = function (section, direction) {
	 * 
	 * if (direction) { section.index++; } else { if (section.index > 0) {
	 * section.index--; } } };
	 * 
	 * $scope.getLessons = function(section){ if (
	 * !section.hasOwnProperty('index')){ section.index = 0; }
	 * 
	 * var l = section.lessons; var i = section.index; var ll =
	 * section.lessons.length; return [ l[i%ll], l[(i+1)%ll], l[(i+2)%ll]]; };
	 * 
	 * LessonService.getHomepageLessons().then(function(data){ $scope.sections =
	 * data; });
	 */

});
