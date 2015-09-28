'use strict';

describe('Controller: ManageUserUpdateCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var ManageUserUpdateCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ManageUserUpdateCtrl = $controller('ManageUserUpdateCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', inject(function () {
        expect(scope.awesomeThings.length).toBe(3);
    }));
});
