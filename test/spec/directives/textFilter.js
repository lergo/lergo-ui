'use strict';

describe('Directive: textFilter', function () {
    beforeEach(function () {
        module('lergoApp','lergoBackendMock');
        module('directives-templates');
    });

    var element;

    it('should create an input tag', inject(function ($rootScope, $compile) {
        element = angular.element('<div text-filter></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('input').length).toBe(1);
    }));
});
