'use strict';

describe('Controller: UsersChangePasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var UsersChangePasswordCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        UsersChangePasswordCtrl = $controller('UsersChangePasswordCtrl', {
            $scope: scope
        });
    }));

    it('should put submit form function on scope', function () {
        expect(typeof(scope.submitForm)).toBe('function');
    });
});
