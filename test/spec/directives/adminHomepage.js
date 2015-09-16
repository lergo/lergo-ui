'use strict';

describe('Directive: adminHomepage', function () {

    // load the directive's module
    beforeEach(module('lergoApp','lergoBackendMock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var setup = inject(function ($compile) {
        element = angular.element('<admin-homepage></admin-homepage>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    it('should make hidden element visible', inject(function () {
        setup();
        expect(element.text()).toBe('this is the adminHomepage directive');
    }));
});
