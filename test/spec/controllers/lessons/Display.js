'use strict';

describe('Controller: LessonsDisplayCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsDisplayCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LessonsDisplayCtrl = $controller('LessonsDisplayCtrl', {
            $scope: scope
        });
    }));

    it('should set currentStepIndex to 0', function () {
        expect(scope.currentStepIndex).toBe(0);
    });
});
