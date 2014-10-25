'use strict';

describe('Directive: lergoLanguageClass', function () {

    // load the directive's module
    beforeEach(module('lergoApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        $rootScope.lergoLanguage = 'lergo-language-test';
        scope = $rootScope.$new();

    }));

    it('should put language from rootScope as class on element', inject(function ($compile) {
        element = angular.element('<div lergo-language-class></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.hasClass('lergo-language-test')).toBe(true);
    }));
});
