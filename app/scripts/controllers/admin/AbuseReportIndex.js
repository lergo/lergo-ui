'use strict';

angular.module('lergoApp').controller('AdminAbuseReportIndexCtrl', function($scope, FilterService, LergoClient, $log, $filter) {

	$scope.adminFilter = {};
	$scope.filterPage = {};

	$scope.adminFilterOpts = {
		'showSubject' : true,
		'showLanguage' : true,
		'showCreatedBy' : true,
		'showSearchText' : true
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
		var requiredUsers = _.difference(_.map($scope.reports, 'userId'), _.map(users, '_id'));
		if (requiredUsers.length > 0) {
			LergoClient.users.findUsersById(requiredUsers).then(function(result) {
				result.data.forEach(function(user) {
					users[user._id] = user;
				});
			});
		}
	});

	$scope.getUser = function(report) {
		return users[report.userId];
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

});
