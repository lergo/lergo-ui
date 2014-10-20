'use strict';

describe('Directive: quizNextQuestionButton', function () {

    // load the directive's module
    beforeEach(module('lergoApp','directives-templates', 'lergoBackendMock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<div quiz-next-question-button></div>');
        element = $compile(element)(scope);
        scope.$digest();

        expect(element.find('button').length).toBe(1);
    }));
});
