'use strict';

describe('Controller: AdminHomepageCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var scope = null;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		$controller('AdminHomepageCtrl', {
			$scope : scope,
			$routeParams : {
				'activeTab' : 'lessons'
			}
		});
	}));

	it('assign empty array changing to scope', function() {
		expect(scope.sections.length).toBe(2);
	});
});
