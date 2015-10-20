'use strict';

describe('Directive: saveStatus', function () {

    // load the directive's module
    beforeEach(module('lergoApp', 'lergoBackendMock'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var setup = inject(function ($compile) {
        scope.status = {};
        element = angular.element('<div save-status="status"></div>');

        element = $compile(element)(scope);
        scope.$digest();
    });

    it('should show saved when status is saved', inject(function () {
        setup();
        scope.status.saved = true;
        scope.$digest();
        expect(element.text()).toContain('saved');
    }));

    it('should show saved when status is saved', inject(function () {
        setup();
        scope.status.errorSaving = true;
        scope.$digest();
        expect(element.text()).toContain('errorSaving');
    }));

    it('should show saved when status is saved', inject(function () {
        setup();
        scope.status.saving = true;
        scope.$digest();
        expect(element.text()).toContain('saving');
    }));
});
