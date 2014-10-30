'use strict';

describe('Controller: AdminAbuseReportIndexCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));
	var scope = null;
	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		$controller('AdminAbuseReportIndexCtrl', {
			$scope : scope
		});
	}));

	it('assign empty array changing to scope', function() {
		expect(typeof (scope.adminFilter)).toBe('object');
	});

});
