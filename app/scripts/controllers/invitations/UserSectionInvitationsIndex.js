'use strict';

angular.module('lergoApp').controller('InvitesIndexCtrl', function($scope, LergoClient, TagsService, $routeParams, $log, $location, $rootScope, localStorageService, $window, $filter) {

	$scope.invitesFilter = {};
	$scope.filterPage = {};
	$scope.invitesFilterOpts = {
		'showSubject' : true,
		'showLanguage' : true,
		'showStudents' : true,
		'showInviteStatus' : true
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
