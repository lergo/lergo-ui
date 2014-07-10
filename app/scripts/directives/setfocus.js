'use strict';

angular.module('lergoApp').directive('setFocus', function($parse) {
	return {
		restrict : 'A',
		link : {
			post : function(scope, element, attrs) {
				var model = $parse(attrs.setFocus);
				scope.$watch(model, function(value) {
					if (value === true) {
						element[0].focus();
					}
				});
			}
		}
	};
});
