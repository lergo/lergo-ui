'use strict';

angular.module('lergoApp').controller('HomepageCtrl', function($scope, LergoClient, FilterService, $location, $log, $sce) {

	$scope.filter = {};
	LergoClient.lessons.getPublicLessons().then(function(result) {
		$scope.lessons = result.data;
	});
	$scope.ageFilter = function(lesson) {
		return FilterService.filterByAge($scope.filter, lesson.age);
	};
	$scope.languageFilter = function(lesson) {
		return FilterService.filterByLanguage($scope.filter, lesson.language);
	};
	$scope.subjectFilter = function(lesson) {
		return FilterService.filterBySubject($scope.filter, lesson.subject);
	};
	$scope.viewsFilter = function(lesson) {
		return FilterService.filterByViews($scope.filter, lesson.views);
	};
	LergoClient.questions.getQuestionsCount().then(function(result) {
		$scope.questionsCount = result.data;
	});
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
	$scope.absoluteShareLink = function(lesson) {
		return window.location.origin + '/#/public/lessons/' + lesson._id + '/share';
	};
	$scope.getQuestionsCount = function(lesson) {
		var qCount = 0;
		if (!lesson || !lesson.steps || lesson.steps.length < 1) {
			return qCount;
		}
		lesson.steps.forEach(function(value) {
			if (!!value.quizItems) {
				qCount = qCount + value.quizItems.length;
			}
		});
		return qCount;
	};
	$scope.getTitleImage = function(lesson) {
		if (!lesson || !lesson.steps || lesson.steps.length < 1) {
			return;
		}
		for ( var i = 0; i < lesson.steps.length; i++) {
			var id = $scope.getVideoId(lesson.steps[i]);
			if (id !== null) {
				lesson.image = $sce.trustAsResourceUrl('http://img.youtube.com/vi/' + id + '/0.jpg');
				break;
			}
		}
	};

	$scope.getVideoId = function(step) {
		var value = null;
		if (!!step && !!step.videoUrl) {
			if (step.videoUrl.toLocaleLowerCase().indexOf('youtu.be') > 0) {
				value = step.videoUrl.substring(step.videoUrl.lastIndexOf('/') + 1);
			} else {
				value = step.videoUrl.split('?')[1].split('v=')[1];
			}
		}

		return value;
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
