'use strict';

angular.module('lergoApp').controller('BaseLayoutCreateCtrl', function($scope, $routeParams, $controller) {

	$scope.sections = [ {
		'id' : 'lessons',
		icon : 'fa fa-university',
		'controller' : 'LessonsIndexCtrl'
	}, {
		'id' : 'questions',
		icon : 'fa fa-question-circle',
		'controller' : 'QuestionsIndexCtrl'
	}, {
		'id' : 'reports',
		icon : 'fa fa-bar-chart-o',
		'controller' : 'ReportsIndexCtrl'
	}, {
		id : 'invites',
		icon : 'fa fa-envelope',
		controller : 'InvitesIndexCtrl'

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
		return 'views/' + $scope.currentSection.id + '/_index.html';
	};
});
