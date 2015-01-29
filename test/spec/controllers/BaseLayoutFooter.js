'use strict';

describe('Controller: BaseLayoutFooterCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var Ctrl, scope, windowMock;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();

        function WindowMock(){
            this.scrollInvoked = false;
            this.scrollTo =  function(){
                this.scrollInvoked = true;
            };

        }
        windowMock = new WindowMock();

		Ctrl = $controller('BaseLayoutFooterCtrl', {
			$scope : scope,
            $window : windowMock
		});
	}));

	it('should test for function', function() {
        expect(windowMock.scrollInvoked).toBe(true);
	});
});
