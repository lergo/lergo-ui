'use strict';

describe('Controller: BaseLayoutFooterCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var Ctrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		Ctrl = $controller('BaseLayoutFooterCtrl', {
			$scope : scope
		});
	}));

	it('should test for function', function() {
		expect(scope.scrollUp).toBe('function');
	});
});
