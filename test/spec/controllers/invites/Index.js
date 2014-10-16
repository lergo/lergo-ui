'use strict';

describe('Controller: InvitesIndexCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var InvitesIndexCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		InvitesIndexCtrl = $controller('InvitesIndexCtrl', {
			$scope : scope
		});
	}));

	it('should attach filter object to scope', function() {
		expect(typeof (scope.invitesFilter)).toBe('object');
	});
});
