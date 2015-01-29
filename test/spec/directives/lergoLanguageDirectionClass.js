'use strict';

describe('Directive: lergoLanguageDirectionClass', function () {

    // load the directive's module
    beforeEach(module('lergoApp', 'lergoBackendMock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope ) {
        scope = $rootScope.$new();
        $rootScope.lergoLanguage = 'en';

    }));

    it('should put language direction as class on element', inject(function ($compile ) {

        element = angular.element('<div lergo-language-direction-class></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.hasClass('ltr')).toBe(true);
    }));
});
