'use strict';

angular.module('lergoApp').controller('ReportsIndexCtrl', function($scope, LergoClient, TagsService, FilterService, $log) {

	$scope.languageFilter = function(report) {
		return FilterService.filterByLanguage(report.data.lesson.language);
	};
	$scope.subjectFilter = function(report) {
		return FilterService.filterBySubject(report.data.lesson.subject);
	};

	$scope.tagsFilter = function(report) {
		return FilterService.filterByTags(report.data.lesson.tags);
	};
	$scope.studentFilter = function(report) {
		return FilterService.filterByInvitee(report.data.invitee.name);
	};
	
	$scope.percentageFilter = function(report) {
		return FilterService.filterByCorrectPercentage(report.correctPercentage);
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		if (checkbox.checked) {
			var filtered = filterItems($scope.reports);
			angular.forEach(filtered, function(item) {
				item.selected = true;
			});
		} else {
			angular.forEach($scope.reports, function(item) {
				item.selected = false;
			});

		}
	};

	function filterItems(items) {
		var filteredItems = [];
		for ( var i = 0; i < items.length; i++) {
			if (!FilterService.filterByInvitee(items[i].data.invitee.name)) {
				continue;
			} else if (!FilterService.filterByLanguage(items[i].data.lesson.language)) {
				continue;
			} else if (!FilterService.filterBySubject(items[i].data.lesson.subject)) {
				continue;
			} else if (!FilterService.filterByTags(items[i].data.lesson.tags)) {
				continue;
			} else if (!FilterService.filterByCorrectPercentage(items[i].correctPercentage)) {
				continue;
			} else {
				filteredItems.push(items[i]);
			}
		}
		return filteredItems;

	}

	$scope.getAll = function() {
		LergoClient.userData.getReports().then(function(result) {
			$scope.reports = result.data;
			$scope.errorMessage = null;
			$scope.availableTags = TagsService.getTagsFromItems($scope.reports);
			$scope.invitees = [];
			angular.forEach($scope.reports, function(item) {
				if ($scope.invitees.indexOf(item.data.invitee.name) === -1) {
					$scope.invitees.push(item.data.invitee.name);
				}
			});
			calculateDuration($scope.reports);
			calculateCorrectPercentage($scope.reports);

		}, function(result) {
			$scope.errorMessage = 'Error in fetching reports : ' + result.data.message;
			$log.error($scope.errorMessage);
		});
	};
	$scope.getAll();

	$scope.deleteReports = function() {
		angular.forEach($scope.reports, function(report) {
			if (report.selected === true) {
				$scope.reports.splice($scope.reports.indexOf(report), 1);
				LergoClient.reports.deleteReport(report).then(function() {
					$scope.errorMessage = null;
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
			angular.forEach(report.answers, function(answer) {
				if (!report.duration) {
					report.duration = answer.duration;
				} else {
					report.duration = report.duration + answer.duration;
				}
			});
		});
	}

	function calculateCorrectPercentage(reports) {
		angular.forEach(reports, function(report) {
			var correct = 0;
			var wrong = 0;
			angular.forEach(report.answers, function(answer) {
				if (answer.checkAnswer.correct === true) {
					correct++;
				} else {
					wrong++;
				}
			});
			report.correctPercentage = (correct * 100) / (correct + wrong);
		});
	}
});
