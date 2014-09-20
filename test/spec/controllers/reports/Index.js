'use strict';

describe('Controller: ReportsIndexCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var ReportsIndexCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		ReportsIndexCtrl = $controller('ReportsIndexCtrl', {
			$scope : scope
		});
	}));

	it('should attach filter object to scope', function() {
		expect(typeof(scope.reportsFilter)).toBe('object');
	});
});
