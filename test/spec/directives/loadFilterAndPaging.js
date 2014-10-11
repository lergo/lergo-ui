'use strict';

describe('Directive: loadFilterAndPaging', function () {

    // load the directive's module
    beforeEach(module('lergoApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should trigger callback after filter and paging loaded', inject(function ($compile) {
        var runMeWasCalled = false;
        scope.runMe = function(){
            runMeWasCalled = true;
        };
        element = angular.element('<div load-filter-and-paging="runMe()"></div>');
        element = $compile(element)(scope);
        scope.$digest();
        expect(typeof(scope.filterLoaded)).toBe('function');
        expect(typeof(scope.pagingLoaded)).toBe('function');

        scope.filterLoaded();
        scope.pagingLoaded();

        expect(runMeWasCalled).toBe(true);
    }));
});
