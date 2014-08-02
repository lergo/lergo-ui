'use strict';

describe('Controller: AdminHomepageCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var AdminHomepageCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AdminHomepageCtrl = $controller('AdminHomepageCtrl', {
            $scope: scope
        });
    }));

    it('assign empty array _users to scope', function () {
        expect(scope._users.length).toBe(0);
    });
});
