'use strict';

describe('Controller: QuestionsUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var QuestionsUpdateCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        QuestionsUpdateCtrl = $controller('QuestionsUpdateCtrl', {
            $scope: scope
        });
    }));

    it('should put addOption function on scope', function () {
        expect(typeof(scope.addOption)).toBe('function');
    });
});
