'use strict';

angular.module('lergoApp').controller('BaseLayoutFooterCtrl', function($scope, $window) {
	$window.scrollTo(0, 0);

    $scope.scrollToTop = function() {
        document.body.scrollTop = 0;
    };
});
