'use strict';

angular.module('lergoApp').directive('scrollToTop', function( $window ) {
	return {
		restrict : 'A',
		link : function postLink() {
            $window.scrollTo(0, 0);
		}
	};
});
