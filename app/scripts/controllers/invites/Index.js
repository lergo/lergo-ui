'use strict';

angular.module('lergoApp').controller('InvitesIndexCtrl',
    function($scope, LergoClient, TagsService, $routeParams, $log,
             $location, $rootScope, localStorageService, $window, $filter,$q,$translate) {

	$scope.invitesFilter = {};
	$scope.filterPage = {};
	$scope.invitesFilterOpts = {
		'showSubject' : true,
		'showLanguage' : true,
		'showStudents' : true,
		'showInviteStatus' : true,
        'showClass' : true
	};

	$scope.invitesPage = {
		selectAll : false
	};

    $scope.getInvitationLink = function(invite){
        if ( invite.invitee.name ) {
            return '#!/public/lessons/' + invite.lessonId + '/intro?invitationId=' + invite._id;
        }else{
            return '#!/public/lessons/' + invite.lessonId + '/classInvite?invitationId=' + invite._id;
        }
    };

	$scope.loadInvites = function() {
		$scope.invitesPage.selectAll = false;
		if (!$scope.filterPage.current) {
			return;
		}
		var queryObj = {
			'filter' : _.merge({}, $scope.invitesFilter),
            'projection' : { 'quizItems' : 0, 'lesson.steps' :0}, // don't bring me quizItems
			'sort' : {
				'lastUpdate' : -1
			},
			'dollar_page' : $scope.filterPage

		};
		var promise = null;
		promise = LergoClient.userData.getInvites(queryObj);

		promise.then(function(result) {
			$scope.invites = result.data.data;
			$scope.filterPage.count = result.data.count;
			$scope.errorMessage = null;
		}, function(result) {
			$scope.errorMessage = 'Error in fetching invites : ' + result.data.message;
			$log.error($scope.errorMessage);
		});

		scrollToPersistPosition();
	};

	$scope.selectAll = function(event) {
		var checkbox = event.target;
		angular.forEach($scope.invites, function(item) {
			item.selected = checkbox.checked;
		});
	};

	$scope.deleteInvites = function() {
		var toDelete = 0;
		if (confirm($filter('translate')('deleteInvites.Confirm'))) {
			angular.forEach($scope.invites, function(invite) {
				if (invite.selected === true) {
					toDelete++;
					LergoClient.lessonsInvitations.remove(invite).then(function() {
						toDelete--;
						$scope.errorMessage = null;
						$scope.invites.splice($scope.invites.indexOf(invite), 1);
						$log.info('invite deleted successfully');
						if (toDelete === 0) {
							$scope.loadInvites();
						}
					}, function(result) {
						$scope.errorMessage = 'Error in deleting invite : ' + result.data.message;
						$log.error($scope.errorMessage);
					});
				}
			});
		}
	};

	$scope.markAsDone = function() {
		var toUpdate = 0;
		angular.forEach($scope.invites, function(invite) {
			if (invite.selected === true) {
				toUpdate++;
				invite.finished = true;
				delete invite.selected;
				LergoClient.lessonsInvitations.update(invite).then(function() {
					toUpdate--;
					$scope.errorMessage = null;
					if (toUpdate === 0) {
						$scope.loadInvites();
					}
				}, function(result) {
					$scope.errorMessage = 'Error in updating invite : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
			}
		});
	};

	$scope.markAsUndone = function() {
		var toUpdate = 0;
		angular.forEach($scope.invites, function(invite) {
			if (invite.selected === true) {
				toUpdate++;
				delete invite.finished;
				delete invite.selected;
				LergoClient.lessonsInvitations.update(invite).then(function() {
					toUpdate--;
					$scope.errorMessage = null;
					if (toUpdate === 0) {
						$scope.loadInvites();
					}
				}, function(result) {
					$scope.errorMessage = 'Error in updating invite : ' + result.data.message;
					$log.error($scope.errorMessage);
				});
			}
		});
	};

    $scope.emailNotification = function (status) {
        var toUpdate = 0;
        angular.forEach($scope.invites, function (invite) {
            if (invite.selected === true) {
                invite.emailNotification = !!status;
                delete invite.selected;
                toUpdate++;
                LergoClient.lessonsInvitations.update(invite).then(function () {
                    toUpdate--;
                    $scope.errorMessage = null;
                    if (toUpdate === 0) {
                        $scope.loadInvites();
                    }
                }, function (result) {
                    $scope.errorMessage = 'Error in updating invite : ' + result.data.message;
                    $log.error($scope.errorMessage);
                });
            }
        });
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

    function getReportForSelectedInvites() {

        var selected = _.filter($scope.invites, function (invite) {
            return invite.selected;
        });

        var selectedIds = _.map(selected, function (invite) {
            return invite._id;
        });

        var queryObj = {
            'filter': {'invitationId': {'$in': selectedIds}},
            'projection': {
                'correctPercentage': 1,
                'data.invitee.name': 1,
                'data.invitee.class': 1,
                'data.lesson.name': 1,
                'duration': 1,
                'lastUpdate': 1,
                'data.lesson.subject': 1,
                '_id': 0
            },
            'limit': 0 // It require all data..
        };
        return LergoClient.userData.getStudentsReports(queryObj);
    }

    $scope.getReports = function () {
        var deferred = $q.defer();
        var promise = getReportForSelectedInvites();
        var headers = $scope.localizedHeaders();
        promise.then(function (result) {
            var data = _.map(result.data.data, function (item) {
                var report = {};
                report[headers[0]] = item.data.lesson.name;
                report[headers[1]] = item.data.invitee.name;
                report[headers[2]] = item.data.invitee.class;
                report[headers[3]] = $translate.instant('filters.subjects.'+item.data.lesson.subject);
                report[headers[4]] = $filter('date')(item.lastUpdate, 'medium');
                report[headers[5]] = item.correctPercentage;
                if (item.duration !== 0) {
                    report[headers[6]] = $filter('duration')(item.duration);
                } else {
                    report[headers[6]] = $translate.instant('report.incomplete');
                }
                return report;
            });
            deferred.resolve(data);
        }, function (result) {
            $scope.errorMessage = 'Error in fetching reports : ' + result.data.message;
            $log.error($scope.errorMessage);
        });
        return deferred.promise;
    };

    $scope.headers = ['name', 'reports.student', 'reports.class', 'reports.subject',
        'reports.takenAt', 'reports.correctPercentage', 'reports.duration'];

    $scope.localizedHeaders = function () {
        return _.map($scope.headers, $translate.instant);
    };

    $scope.getExportFileName = function () {
        return 'reports_'+  $filter('date')(Date.now(), 'medium')+'.csv';
    };

});
