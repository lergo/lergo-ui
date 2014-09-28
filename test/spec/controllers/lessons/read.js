'use strict';

describe('Controller: LessonsReadCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsReadCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LessonsReadCtrl = $controller('LessonsReadCtrl', {
            $scope: scope
        });
    }));

    it('should put getDisplayUrl on scope', function () {
        expect(typeof(scope.getDisplayUrl)).toBe('function');
    });
});
