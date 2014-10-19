'use strict';

describe('Controller: QuestionsAddUpdateDialogCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var QuestionsAddupdatedialogCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		QuestionsAddupdatedialogCtrl = $controller('QuestionsAddupdatedialogCtrl', {
			$scope : scope
		});
	}));

});
