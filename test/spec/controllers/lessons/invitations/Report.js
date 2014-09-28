'use strict';

describe('Controller: LessonsInvitationsReportCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsInvitationsReportCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LessonsInvitationsReportCtrl = $controller('LessonsInvitationsReportCtrl', {
            $scope: scope
        });
    }));

    it('should attach stats to the scope', function () {
        expect(scope.stats.length).toBe(0);
    });
});
