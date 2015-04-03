'use strict';

describe('Controller: UsersProfileCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var UsersProfileCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        UsersProfileCtrl = $controller('UsersProfileCtrl', {
            $scope: scope
        });
    }));
    it('should put saveProfile function to the scope', function () {
        expect(scope.isEditAllow).toBe(false);
    });
});
