'use strict';

angular.module('lergoApp').controller('FilterCtrl', function($scope, FilterService, $rootScope) {
	$scope.subjects = FilterService.subjects;
	$scope.languages = FilterService.languages;
	$rootScope.filter = {
		'language' : FilterService.getLanguageByLocale($rootScope.lergoLanguage)
	};

	$scope.$on('siteLanguageChanged', function() {

		if (!$rootScope.filter) {
			$rootScope.filter = {};
		}
		$rootScope.filter.language = FilterService.getLanguageByLocale($rootScope.lergoLanguage);
	});

});
