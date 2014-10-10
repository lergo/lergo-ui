'use strict';

describe('Directive: lergoFilter', function () {
    beforeEach(module('lergoApp', 'directives-templates', 'lergoBackendMock', 'LocalStorageModule'));

    var element;

    it('should have a form in display', inject(function ($rootScope, $compile) {
        $rootScope.model = {};
        element = angular.element('<div lergo-filter model="model"></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect($(element).find('form').length === 1 || $(element).is('form')).toBe(true);
    }));


    // tests that fix to LERGO-490 applies.
    // the fix contained
    it('should trigger watch functions when loading from local storage', inject(function($rootScope, localStorageService, $timeout, $compile){
        $rootScope.model = {};
        $rootScope.opts = { 'showAge' : true };
        localStorageService.set('lergoFilter.ageFilter', { 'min' : 10 });
        element = angular.element('<div lergo-filter opts="opts" model="model"></div>');
        element = $compile(element)($rootScope);

        $rootScope.$digest();
        $timeout.flush();
        /*jshint camelcase: false */
        expect(element.children().scope().model.age.dollar_gte).toBe(10);

    }));
});
