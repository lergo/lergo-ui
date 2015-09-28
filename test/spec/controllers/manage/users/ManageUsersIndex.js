'use strict';

describe('Controller: AdminManageUsersIndexCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var AdminManageUsersIndexCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AdminManageUsersIndexCtrl = $controller('AdminManageUsersIndexCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', inject(function () {
        expect(scope.awesomeThings.length).toBe(3);
    }));
});
