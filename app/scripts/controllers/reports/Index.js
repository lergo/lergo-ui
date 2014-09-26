'use strict';

angular.module('lergoApp').controller('ReportsIndexCtrl', function($scope, LergoClient, TagsService, FilterService, $log, $location, $rootScope) {

    $scope.reportsFilter = {  };
    $scope.filterPage = { };
    $scope.reportsFilterOpts = {
        'showSubject' : true,
        'showLanguage' : true,
        'showReportStatus' : true,
        'showCorrectPercentage' : true
    };
    
    
	$scope.loadReports = function() {
        var queryObj = { 'filter': _.merge({}, $scope.reportsFilter), 'sort' : { 'lastUpdate' : -1 }, 'dollar_page': $scope.filterPage };
		LergoClient.userData.getReports(queryObj).then(function(result) {
			$scope.reports = result.data.data;
            $scope.filterPage.count = result.data.count;
			$scope.errorMessage = null;
			$scope.invitees = [];
			angular.forEach($scope.reports, function(item) {
				if ($scope.invitees.indexOf(item.data.invitee.name) === -1) {
					$scope.invitees.push(item.data.invitee.name);
				}
			});
		}, function(result) {
			$scope.errorMessage = 'Error in fetching reports : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};
	$scope.createLessonFromWrongQuestions = function() {
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			lesson.name = 'Difficult questions lesson from : ';
            // todo: remove filter Service getLanguageByLocale - this should be coming from translate service.
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
        angular.forEach($scope.reports, function (item) {
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
		angular.forEach($scope.reports, function(report) {
			if (report.selected === true) {
				LergoClient.reports.deleteReport(report).then(function() {
					$scope.errorMessage = null;
					$scope.reports.splice($scope.reports.indexOf(report), 1);
					$log.info('report deleted successfully');
				}, function(result) {
					$scope.errorMessage = 'Error in deleting report : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
			}
		});
	};


});
