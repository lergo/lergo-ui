'use strict';

describe('Controller: KitchenSinkCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var KitchenSinkCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        KitchenSinkCtrl = $controller('KitchenSinkCtrl', {
            $scope: scope
        });
    }));

    it('should attach tags to scope', function () {
        expect(!!scope.hello).toBe(true);
    });
});
