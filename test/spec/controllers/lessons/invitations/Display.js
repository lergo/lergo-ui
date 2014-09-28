'use strict';

describe('Controller: LessonsInvitationsDisplayCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsInvitationsDisplayCtrl,
        scope;

    var buildWasInvoked = false;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        LessonsInvitationsDisplayCtrl = $controller('LessonsInvitationsDisplayCtrl', {
            $scope: scope,
            LergoClient: {
                lessonsInvitations: {
                    build: function () {
                        buildWasInvoked = true;
                        return $q.defer().promise;
                    }
                }
            }
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(buildWasInvoked).toBe(true);
    });
});
