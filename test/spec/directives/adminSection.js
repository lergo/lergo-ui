'use strict';

describe('Directive: adminSection', function () {
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element;

    it('should make hidden element visible', inject(function ($rootScope, $compile) {
        element = angular.element('<div admin-section></div>');
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('.ng-hide').length).toBe(1);
    }));
});
