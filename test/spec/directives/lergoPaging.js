'use strict';

describe('Directive: lergoPaging', function () {
    beforeEach(module('lergoApp','directives-templates','lergoBackendMock'));

    window.conf = { 'filtering' :  {'defaultPageSize' :20 } };

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div lergo-paging></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect($(element).find('.pagination').length).toBe(2);
    }));
});
