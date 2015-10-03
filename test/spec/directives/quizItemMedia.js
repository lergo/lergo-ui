'use strict';

describe('Directive: quizItemMedia', function () {
    beforeEach(module('lergoApp', 'directives-templates','lergoBackendMock'));

    var element;

    it('should add function getMediaTemplate to scope', inject(function ($rootScope, $compile) {
        element = angular.element('<div quiz-item-media></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(typeof(element.children().scope().getMediaTemplate)).toBe('function');
    }));
});
