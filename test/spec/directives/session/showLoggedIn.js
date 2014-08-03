'use strict';

describe('Directive: session/showLoggedIn', function () {
    beforeEach(module('lergoApp'));

    var element;

    it('should hide element if not user on root scope', inject(function ($rootScope, $compile) {
        element = angular.element('<div show-logged-in></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.is(':hidden')).toBe(true);
    }));
});
