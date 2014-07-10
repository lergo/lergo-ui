'use strict';

angular.module('lergoApp').directive('setFocus', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.setFocus);
			scope.$watch(model, function(value) {
				if (value === true) {
					element[0].focus();
				}
			});
			element.bind('blur', function() {
				if (!!model) {
					scope.$apply(model.assign(scope, false));
				}
			});
		}
	};
});
