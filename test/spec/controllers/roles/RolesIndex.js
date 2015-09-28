'use strict';

describe('Controller: RolesIndexCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var RolesIndexCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        RolesIndexCtrl = $controller('RolesIndexCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', inject(function () {
        expect(scope.awesomeThings.length).toBe(3);
    }));
});
