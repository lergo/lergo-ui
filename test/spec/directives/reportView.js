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


    it('should display duration in format hh:mm:ss', function () {
        expect(elementScope.getDuration(0)).toBe('00:00:00');
        expect(elementScope.getDuration(606012345)).toBe('68:20:12');
    });
});
