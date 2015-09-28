'use strict';

describe('Controller: security/RolesUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var RolesUpdateCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        RolesUpdateCtrl = $controller('RolesUpdateCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', inject(function () {
        expect(scope.awesomeThings.length).toBe(3);
    }));
});
