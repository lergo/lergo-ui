'use strict';

angular.module('lergoApp').controller('FilterCtrl', function($scope, FilterService) {
	$scope.subjects = FilterService.subjects;
	$scope.languages = FilterService.languages;
});
