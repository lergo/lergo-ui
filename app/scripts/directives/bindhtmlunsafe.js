'use strict';

angular.module('lergoApp').directive('bindHtmlUnsafe', function( $compile) {
	return function($scope, $element, $attrs) {
		var compile = function(newHTML) {
			newHTML = $compile(newHTML)($scope);
			$element.html('').append(newHTML);
		};

		var htmlName = $attrs.bindHtmlUnsafe;

		$scope.$watch(htmlName, function(newHTML) {
			if (!newHTML)
				return;
			compile(newHTML);
		});

	};
});