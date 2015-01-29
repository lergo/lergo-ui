'use strict';

angular.module('lergoApp').controller('LessonsInvitationsReportCtrl', function($scope, $log, LergoClient, $routeParams, $rootScope, FilterService, $location, $filter) {
	$log.info('loading');
	LergoClient.reports.getById($routeParams.reportId).then(function(result) {
		$scope.report = result.data;
		getWrongQuestion($scope.report);
		$rootScope.page = {
			'title' : $scope.report.data.lesson.name,
			'description' : $scope.report.data.lesson.description
		};
		$rootScope.lergoLanguage = FilterService.getLocaleByLanguage($scope.report.data.lesson.language);
	});
	$scope.stats = [];
	$scope.$on('stats', function(event, data) {
		$scope.stats[data.index] = data;
	});

	$scope.absoluteShareLink = function(id) {
		return window.location.origin + '/#!/public/lessons/' + id + '/intro';
	};

	$scope.startLesson = function(lessonId) {
		if (!lessonId) {
			redirectToInvitation($scope.report.data.lesson._id, $scope.report.invitationId);
		} else {
			LergoClient.lessonsInvitations.createAnonymous(lessonId).then(function(result) {
				redirectToInvitation(lessonId, result.data._id);
			});
		}
	};
	function redirectToInvitation(lessonId, invId) {
		// in case of temporary lesson we don't want to remember history
		if (!$scope.report.data.lesson.temporary) {
			$location.path('/public/lessons/invitations/' + invId + '/display').search({
				lessonId : lessonId
			});
		} else {
			$location.path('/public/lessons/invitations/' + invId + '/display').search({
				lessonId : lessonId
			}).replace();
		}
	}
	$scope.practiceMistakes = function() {
		createLessonFromWrongQuestions();
	};
	function getWrongQuestion(report) {
		$scope.wrongQuestions = [];
		angular.forEach(report.answers, function(answer) {
			if (!answer.checkAnswer.correct) {
				$scope.wrongQuestions.push(answer.quizItemId);
			}
		});
	}
	function createLessonFromWrongQuestions() {
		if ($scope.wrongQuestions.length > 0) {
			var report = $scope.report;
			LergoClient.lessons.create().then(function(result) {
				var lesson = result.data;
				lesson.name = $filter('i18n')('lesson.practice.title') + report.data.lesson.name;
				// todo: remove filter Service getLanguageByLocale - this should
				// be
				// coming from translate service.
				lesson.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
				lesson.subject = report.data.lesson.subject;
				lesson.steps = [];
				var stepsWithoutRetry = _.filter(report.data.lesson.steps, function(s) {
					if (s.type === 'quiz') {
						return !s.retryQuestion;
					}
				});
				lesson.description = report.data.lesson.description;
				lesson.lastUpdate = new Date().getTime();
				lesson.temporary = true;
				var step = {
					'type' : 'quiz',
					'quizItems' : [],
					'testMode' : 'False',
					'shuffleQuestion' : true,
					retryQuestion : stepsWithoutRetry.length === 0
				};
				lesson.steps.push(step);
				lesson.steps[0].quizItems = $scope.wrongQuestions;
				LergoClient.lessons.update(lesson).then(function() {
					$scope.startLesson(lesson._id);
				});
			});
		}
	}

});
