'use strict';

describe('Directive: setFocus', function () {

    // load the directive's module
    beforeEach(module('lergoApp'));

    var element,
        scope;

    var watchWasCalled = false;
    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        scope.$watch = function () {
            watchWasCalled = true;
        };
    }));

    it('should add a watch on the scope', inject(function ($compile) {

        element = angular.element('<div set-focus></div>');
        element = $compile(element)(scope);
        expect(watchWasCalled).toBe(true);
    }));
});
