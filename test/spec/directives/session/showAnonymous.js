'use strict';

describe('Directive: session/showAnonymous', function () {
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element;

    it('should show element if no user on rootScope', inject(function ($rootScope, $compile) {
        element = angular.element('<div show-anonymous></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        var elementHtml =  $(element)[0].outerHTML; // guy - for some reason element.css('display') - returned a map instead of value.. so I am using this stupid method now..
        expect(elementHtml.indexOf('display: block;') > 0).toBe(true);
    }));
});
