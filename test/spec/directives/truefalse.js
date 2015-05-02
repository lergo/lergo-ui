'use strict';

describe('Directive: trueFalse', function() {

	// load the directive's module
	beforeEach(module('lergoApp','directives-templates','lergoBackendMock'));

	var element;

	it('should put answer on quiz item and submit', inject(function($rootScope, $compile) {
        $rootScope.onSubmit = jasmine.createSpy();
        $rootScope.quizItem = { 'question' : 'foo' } ;
		element = angular.element('<div true-false quiz-item="quizItem" on-click="onSubmit()"></div>');
		element = $compile(element)($rootScope);
		$rootScope.$digest();
        var isolatedScope = element.children().scope();
        isolatedScope.submit('bar');
		expect($rootScope.onSubmit).toHaveBeenCalled();
        expect($rootScope.quizItem.userAnswer).toBe('bar');
	}));

});
