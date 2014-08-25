'use strict';

angular.module('lergoApp').controller('FilterCtrl', function($scope, FilterService, $rootScope) {
	$scope.subjects = FilterService.subjects;
	$scope.languages = FilterService.languages;
	$scope.status=FilterService.status;
	$scope.reportStatus=FilterService.reportStatus;
	$scope.initFilter = function() {
		if (!$rootScope.filter) {
			$rootScope.filter = {
				'language' : FilterService.getLanguageByLocale($rootScope.lergoLanguage)
			};
		}
	};

	$scope.$on('siteLanguageChanged', function() {

		if (!$rootScope.filter) {
			$rootScope.filter = {};
		}
		$rootScope.filter.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
	});
	$scope.initFilter();

});
