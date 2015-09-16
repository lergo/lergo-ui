'use strict';

describe('Directive: createYourOwnBox', function () {
    beforeEach(module('lergoApp', 'directives-templates','lergoBackendMock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {

        element = angular.element('<div create-your-own-box></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(typeof(element.children().scope().create)).toBe('function');
    }));
});
