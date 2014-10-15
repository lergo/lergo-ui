'use strict';

angular.module('lergoApp').controller('ReportsIndexCtrl', function($scope, LergoClient, TagsService, $routeParams, FilterService, $log, $location, $rootScope, localStorageService, $window, $filter) {

	$scope.reportsFilter = {};
	$scope.filterPage = {};
	$scope.reportsFilterOpts = {
		'showSubject' : true,
		'showLanguage' : true,
		'showReportStatus' : true,
		'showStudents' : true,
		'showCorrectPercentage' : true
	};

	$scope.reportTypes = [ {
		'id' : 'mine'
	}, {
		'id' : 'students'
	} ];

	$scope.reportsPage = {
		reportType : 'students',
		selectAll : false
	};

	function isMyReports() {
		return $scope.reportsPage.reportType === 'mine';
	}

	$scope.$watch('reportsPage.reportType', function(newValue/* , oldValue */) {
		$log.info('reportType changed');
		$scope.reportsFilterOpts.showStudents = isStudentsReports();
		$scope.filterPage.current = 1;
		$scope.filterPage.updatedLast = new Date().getTime(); // create a
		// 'change'
		// event
		// artificially..
		localStorageService.set('reportType', newValue);
		$location.search('reportType', newValue);

	});

	var reportType = $routeParams.reportType || localStorageService.get('reportType');
	if (!!reportType) {
		$scope.reportsPage.reportType = reportType;
	}

	function isStudentsReports() {
		return $scope.reportsPage.reportType === 'students';
	}

	$scope.showStudentColumn = function() {
		return isStudentsReports();
	};

	$scope.isComplete = function(report) {

		var completeSteps = 0;
		_.each(report.stepDurations, function(elem) {
			if (angular.isNumber(elem.startTime) && angular.isNumber(elem.endTime)) {
				completeSteps++;
			}
		});

		return report.data.lesson.steps.length === completeSteps || report.duration > 0;
	};

	$scope.loadReports = function() {
		$scope.reportsPage.selectAll = false;
		if (!$scope.filterPage.current) {
			return;
		}
		var queryObj = {
			'filter' : _.merge({}, $scope.reportsFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		var promise = null;
		if (isMyReports()) {
			promise = LergoClient.userData.getReports(queryObj);
		} else if (isStudentsReports()) {
			promise = LergoClient.userData.getStudentsReports(queryObj);
		}

		promise.then(function(result) {
			$scope.reports = result.data.data;
			$scope.filterPage.count = result.data.count;
			$scope.errorMessage = null;
		}, function(result) {
			$scope.errorMessage = 'Error in fetching reports : ' + result.data.message;
			$log.error($scope.errorMessage);
		});

		scrollToPersistPosition();
	};
	$scope.createLessonFromWrongQuestions = function() {
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			lesson.name = 'Difficult questions lesson from : ';
			// todo: remove filter Service getLanguageByLocale - this should be
			// coming from translate service.
			lesson.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
			lesson.steps = [];
			lesson.description = '';
			lesson.lastUpdate = new Date().getTime();
			var step = {
				'type' : 'quiz',
				'quizItems' : [],
				'title' : 'Difficult Questions'
			};
			lesson.steps.push(step);
			angular.forEach($scope.reports, function(report) {
				if (report.selected === true) {
					lesson.name = lesson.name + report.data.lesson.name + ',';
					lesson.description = lesson.description + report.data.lesson.name + '\n';
					getWrongQuestions(report.answers, lesson);
				}
			});
			lesson.name = lesson.name.slice(0, -1);
			LergoClient.lessons.update(lesson).then(function() {
				$location.path('/user/lessons/' + lesson._id + '/intro');
			});
		});

	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		angular.forEach($scope.reports, function(item) {
			item.selected = checkbox.checked;
		});
	};

	function getWrongQuestions(answers, lesson) {
		angular.forEach(answers, function(answer) {
			if (!answer.checkAnswer.correct) {
				lesson.steps[0].quizItems.push(answer.quizItemId);
			}
		});
	}
	$scope.deleteReports = function() {
		var toDelete = 0;
		if (confirm($filter('i18n')('deleteReports.Confirm'))) {
			angular.forEach($scope.reports, function(report) {
				if (report.selected === true) {
					toDelete++;
					LergoClient.reports.deleteReport(report).then(function() {
						toDelete--;
						$scope.errorMessage = null;
						$scope.reports.splice($scope.reports.indexOf(report), 1);
						$log.info('report deleted successfully');
						if (toDelete === 0) {
							$scope.loadReports();
						}
					}, function(result) {
						$scope.errorMessage = 'Error in deleting report : ' + result.data.message;
						$log.error($scope.errorMessage);
					});
				}
			});
		}
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
