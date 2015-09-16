'use strict';

describe('Directive: quizItemExplanationMedia', function () {

    // load the directive's module
    beforeEach(module('lergoApp', 'directives-templates','lergoBackendMock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should add getUrl to scope', inject(function ($compile, $rootScope) {
        element = angular.element('<div quiz-item-explanation-media></div>');
        element = $compile(element)(scope);
        $rootScope.$digest();
        expect(typeof(element.children().scope().getUrl)).toBe('function');
    }));
});
