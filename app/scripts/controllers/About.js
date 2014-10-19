'use strict';

angular.module('lergoApp').controller('AboutCtrl', function($scope, $routeParams) {
	$scope.sections = [ {
		id : 'overview'

	}, {
		id : 'contribute'

	}, {
		id : 'keyContributors'

	}, {
		id : 'keyFunders'

	}, {
		id : 'keyFundersPictures'

	}, {
		id : 'friends'

	}, {
		id : 'faq'

	}, {
		id : 'privacy'

	}, {
		id : 'contact'

	} ];

	$scope.currentSection = _.find($scope.sections, function(section) {
		return $routeParams.activeAboutTab === section.id;
	});

	$scope.isActive = function(section) {
		return !!$scope.currentSection && section.id === $scope.currentSection.id;
	};

	$scope.getInclude = function() {
		return 'views/about/_' + $scope.currentSection.id + '.html';
	};
});
