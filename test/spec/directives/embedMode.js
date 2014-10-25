'use strict';

describe('Directive: embedMode', function () {

    // load the directive's module
    beforeEach(module('lergoApp'));

    var element,
        scope;

    beforeEach(function(){
        var $window = { parent: null };

        module(function($provide) {
            $provide.value('$window', $window);
        });
    });

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should put lergo-embed-mode class when not top window', inject(function ($compile) {
        element = angular.element('<div embed-mode></div>');
        element = $compile(element)(scope);
        scope.$digest();

        expect(element.hasClass('lergo-embed-mode')).toBe(true);
    }));
});
