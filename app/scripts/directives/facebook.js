'use strict';

angular.module('lergoApp').directive('facebook', function($timeout,$window) {
	return {
		transclude : true,
		templateUrl : 'views/directives/_facebook.html',
		link : function(scope, element, attr) {
			$timeout(function() {
				element.bind('click', function(e) {
					$window.FB.ui({
						method : 'share',
						href : attr.url
					});
					e.preventDefault();
				});
			});
		}
	};
});