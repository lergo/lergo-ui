'use strict';

describe('Directive: lessonView', function () {
    beforeEach(module('lergoApp', 'directives-templates'));

    var element;
    var elementScope;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div lesson-view></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        elementScope = element.children().scope();
        expect(typeof(elementScope.isCorrectAnswer)).toBe('function');
    }));


});
