'use strict';

describe('Directive: lergoLanguageClass', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element,
        LergoTranslate,
        scope;

    beforeEach(inject(function ($rootScope, _LergoTranslate_) {
        LergoTranslate = _LergoTranslate_;
        spyOn(LergoTranslate,'getLanguage').andReturn('lergo-language-test');
        scope = $rootScope.$new();

    }));

    it('should put language from LergoTranslate getLanguage on element', inject(function ($compile) {
        element = angular.element('<div lergo-language-class></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.hasClass('lergo-language-test')).toBe(true,'expected lergo-language-test to be on element');
    }));
});
