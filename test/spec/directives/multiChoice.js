'use strict';

describe('Directive: multiChoice', function() {

	// load the directive's module
	beforeEach(module('lergoApp','directives-templates'));

	var element, scope;

	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));

	it('should make hidden element visible', inject(function($compile) {
		element = angular.element('<div multi-choice></div>');
		element = $compile(element)(scope);
        scope.$digest();
		expect(typeof(element.children().scope().isMultiChoiceMultiAnswer)).toBe('function');
	}));
});
