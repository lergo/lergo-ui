'use strict';

describe('Controller: AdminLessonIndexCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var scope = null;
	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		$controller('AdminLessonIndexCtrl', {
			$scope : scope
		});
	}));

});
