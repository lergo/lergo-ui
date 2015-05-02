'use strict';

describe('Directive: lessonView', function () {
    beforeEach(module('lergoApp', 'directives-templates'));

    var element;
    var elementScope;

    beforeEach(inject(function($rootScope, $compile){
        element = angular.element('<div lesson-view></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        elementScope = element.children().scope();
        spyOn(elementScope,'$emit');
    }));

    it('should make hidden element visible', inject(function () {
        expect(typeof(elementScope.isCorrectAnswer)).toBe('function');
    }));

    describe('getAnswerStatus', function(){
        it('should emit stats', function(){
            elementScope.getAnswerStats([{}]);
            expect(elementScope.$emit).toHaveBeenCalled();
        });

        it('should do nothing if no results', function(){
            elementScope.getAnswerStats();
            expect(elementScope.$emit).not.toHaveBeenCalled();
        });
    });


});
