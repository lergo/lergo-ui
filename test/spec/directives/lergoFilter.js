'use strict';

describe('Directive: lergoFilter', function () {
    beforeEach(module('lergoApp', 'directives-templates', 'lergoBackendMock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        $rootScope.model = {};
        element = angular.element('<div lergo-filter model="model"></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect($(element).find('form').length === 1 || $(element).is('form')).toBe(true);
    }));
});
