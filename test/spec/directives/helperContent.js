'use strict';

describe('Directive: helperContent', function() {

	// load the directive's module
	beforeEach(module('lergoApp', 'directives-templates', 'lergoBackendMock'));

	var element, scope;

	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));

	it('should make hidden element visible', inject(function($compile) {
		element = angular.element('<div helper-content></div>');
		element = $compile(element)(scope);
        scope.$digest();
		expect(typeof(element.children().scope().isSaving)).toBe('function');
	}));
});
