'use strict';

describe('Directive: session/showAnonymous', function () {
    beforeEach(module('lergoApp'));

    var element;

    it('should show element if no user on rootScope', inject(function ($rootScope, $compile) {
        element = angular.element('<div show-anonymous></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.css('display')).toBe('block');
    }));
});
