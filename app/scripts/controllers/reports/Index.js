'use strict';

angular.module('lergoApp').controller('ReportsIndexCtrl', function($scope, LergoClient, TagsService, FilterService, $log, $location) {


    $scope.totalResults = 0;
    $scope.reportsFilter = {  };
    $scope.filterPage = { };
    $scope.reportsFilterOpts = {
        'showSubject' : true,
        'showLanguage' : true,
        'showReportStatus' : true
    };

    $scope.loadReports = function () {
        var queryObj = { 'filter': _.merge({}, $scope.reportsFilter), 'dollar_page': $scope.filterPage };
        LergoClient.userData.getReports(queryObj).then(function (result) {
            $scope.reports = result.data.data;
            $scope.filterPage.count = result.data.count;
            $scope.totalResults = result.data.total;
            $scope.errorMessage = null;

            $scope.invitees = [];
            angular.forEach($scope.reports, function (item) {
                if ($scope.invitees.indexOf(item.data.invitee.name) === -1) {
                    $scope.invitees.push(item.data.invitee.name);
                }
            });
            calculateDuration($scope.reports);
            calculateCorrectPercentage($scope.reports);

        }, function (result) {
            $scope.errorMessage = 'Error in fetching reports : ' + result.data.message;
            $log.error($scope.errorMessage);
        });
    };

	$scope.createLessonFromWrongQuestions = function() {
		LergoClient.lessons.create().then(function(result) {
			var lesson = result.data;
			lesson.name = 'Difficult questions lesson';
			lesson.steps = [];
			lesson.description = '';
			var step = {
				'type' : 'quiz',
				'quizItems' : [],
				'title' : 'Difficult Questions'
			};
			lesson.steps.push(step);
			angular.forEach($scope.reports, function(report) {
				if (report.selected === true) {
					lesson.description = lesson.description + report.data.lesson.name + '\n';
					getWrongQuestions(report.answers, lesson);
				}
			});

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

	function calculateDuration(reports) {
		angular.forEach(reports, function(report) {
			report.duration = 0;
			angular.forEach(report.stepDurations, function(duration) {
				if (!!duration.startTime && !!duration.endTime) {
					report.duration = report.duration + (duration.endTime - duration.startTime);
				}
			});
			report.duration = (Math.round(report.duration / 1000)) * 1000;
		});
	}

	function calculateCorrectPercentage(reports) {
		angular.forEach(reports, function(report) {
			var correct = 0;
			var wrong = 0;
			report.correctPercentage = 0;
			var numberOfQuestions = 0;
			angular.forEach(report.data.lesson.steps, function(step) {
				if (step.type === 'quiz' && !!step.quizItems) {
					numberOfQuestions = numberOfQuestions + step.quizItems.length;
				}
			});
			if (!!report.data.quizItems && numberOfQuestions > 0) {
				angular.forEach(report.answers, function(answer) {
					if (answer.checkAnswer.correct === true) {
						correct++;
					} else {
						wrong++;
					}
				});

				report.correctPercentage = Math.round((correct * 100) / numberOfQuestions);
			}
		});
	}
});
