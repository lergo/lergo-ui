'use strict';

angular.module('lergoApp').controller('AdminHomepageCtrl', function($scope, $routeParams, $controller) {

	$scope.sections = [ {
		'id' : 'lessons',
		icon : 'fa fa-university',
		'controller' : 'AdminLessonIndexCtrl'
	}, {
		'id' : 'abuseReports',
		icon : 'fa fa-flag',
		'controller' : 'AdminAbuseReportIndexCtrl'
	} ];

	$scope.currentSection = _.find($scope.sections, function(section) {
		return $routeParams.activeTab === section.id;
	});

	$controller($scope.currentSection.controller, {
		$scope : $scope
	});

	$scope.isActive = function(section) {
		return !!$scope.currentSection && section.id === $scope.currentSection.id;
	};

	$scope.getInclude = function() {
		return 'views/admin/' + $scope.currentSection.id + '/_index.html';
	};
});
