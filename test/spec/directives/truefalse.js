'use strict';

describe('Directive: trueFalse', function() {

	// load the directive's module
	beforeEach(module('lergoApp'));

	var element;

	it('should add true false answer option', inject(function($rootScope, $compile) {
		element = angular.element('<true-false></true-false>');
		element = $compile(element)($rootScope);
		$rootScope.$digest();
		// expect(element.text()).toBe('this is the trueFalse directive');
	}));

});
