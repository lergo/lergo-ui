'use strict';

describe('Controller: AboutCtrl', function() {

	// load the controller's module
	beforeEach(module('lergoApp'));

	var AboutCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		AboutCtrl = $controller('AboutCtrl', {
			$scope : scope
		});
	}));

    it('should assign sections on scope', function(){
        expect(!!scope.sections).toBe(true);
    });

    describe('isActive',function(){
        it('should return true iff current section is active', function(){
            scope.currentSection = { 'id': 'foo'};
            expect(scope.isActive({ 'id' : 'foo'})).toBe(true);
        });
    });

    describe('getInclude', function(){
        it('should return the url to include', function(){
            scope.currentSection = { 'id' : 'foo' };
            expect(scope.getInclude()).toBe('views/about/_foo.html');
        });
    });
});
