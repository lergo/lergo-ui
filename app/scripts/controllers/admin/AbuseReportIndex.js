'use strict';

angular.module('lergoApp').controller('AdminAbuseReportIndexCtrl', function($scope, FilterService, LergoClient, $log, $filter) {

	$scope.adminFilter = {};
	$scope.filterPage = {};

	$scope.adminFilterOpts = {
		showSubject : true,
		showLanguage : true,
		showCreatedBy : true,
		showSearchText : true,
		showReportedBy : true,
		showAbuseReportStatus : true

	};

	$scope.load = function() {
		var queryObj = {
			'filter' : _.merge({}, $scope.adminFilter),
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage
		};
		LergoClient.abuseReports.getAll(queryObj).then(function(result) {
			$scope.reports = result.data.data;
			$scope.filterPage.count = result.data.count;
		});
	};

	function loadStats() {
		$scope.updateStats(true);
	}

	var users = {};

	$scope.$watch('reports', function() {
		var requiredReporters = _.difference(_.map($scope.reports, 'userId'), _.map(users, '_id'));
		var requiredCreators = _.difference(_.map($scope.reports, 'itemUserId'), _.map(users, '_id'));
		var requiredUsers = _.union(requiredReporters, requiredCreators);
		if (requiredUsers.length > 0) {
			LergoClient.users.findUsersById(requiredUsers).then(function(result) {
				result.data.forEach(function(user) {
					users[user._id] = user;
				});
			});
		}
	});

	$scope.getUser = function(id) {
		return users[id];
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		angular.forEach($scope.reports, function(item) {
			item.selected = checkbox.checked;
		});
	};

	$scope.deleteReports = function() {
		var toDelete = 0;
		if (confirm($filter('i18n')('deleteReports.Confirm'))) {
			angular.forEach($scope.reports, function(report) {
				if (report.selected === true) {
					toDelete++;
					LergoClient.abuseReports.deleteReports(report._id).then(function() {
						$scope.errorMessage = null;
						toDelete--;
						$scope.reports.splice($scope.reports.indexOf(report), 1);
						$log.info('Report deleted sucessfully');
						if (toDelete === 0) {
							loadStats();
						}
					}, function(result) {
						$scope.errorMessage = 'Error in deleting Report : ' + result.data.message;
						$log.error($scope.errorMessage);
					});
				}

			});
		}
	};
	$scope.changing = [];
	var changing = $scope.changing;
	function save(report) {
		// preserving selected state of report
		var selected = report.selected;
		delete report.selected;
		changing.push(report._id);
		LergoClient.abuseReports.update(report).then(function success(result) {
			var indexOf = $scope.reports.indexOf(report);
			result.data.selected = selected;
			$scope.reports[indexOf] = result.data;
			changing.splice(changing.indexOf(report._id), 1);
			loadStats();
			$scope.load();
		}, function error() {
			changing.splice(changing.indexOf(report._id), 1);
		});
	}

	$scope.pending = function() {
		angular.forEach($scope.reports, function(report) {
			if (report.selected === true) {
				report.status = 'pending';
				save(report);
			}
		});
	};
	$scope.resolved = function() {
		angular.forEach($scope.reports, function(report) {
			if (report.selected === true) {
				report.status = 'resolved';
				save(report);
			}
		});
	};
	$scope.dismissed = function() {
		angular.forEach($scope.reports, function(report) {
			if (report.selected === true) {
				report.status = 'dismissed';
				save(report);
			}
		});
	};

});
