(function () {
	'use strict';
	BaseLayoutFooterCtrl.$inject = ['$scope', '$window'];
	function BaseLayoutFooterCtrl($scope, $window) {
		$window.scrollTo(0, 0);
	}
	angular.module('lergoApp')
		.controller('BaseLayoutFooterCtrl', BaseLayoutFooterCtrl );
})();
