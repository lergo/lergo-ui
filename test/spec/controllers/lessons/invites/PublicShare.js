'use strict';

describe('Controller: LessonsInvitesPublicShareCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsInvitesPublicShareCtrl,
        scope;
    var createAnonymousInvoked = false;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        LessonsInvitesPublicShareCtrl = $controller('LessonsInvitesPublicShareCtrl', {
            $scope: scope,
            LergoClient: {
                lessonsInvitations: {
                    createAnonymous: function () {
                        createAnonymousInvoked = true;
                        return $q.defer().promise;
                    }
                }
            }
        });
    }));

    it('should call createAnonymous on LergoClient.lessonsInvitations', function () {
        expect(createAnonymousInvoked).toBe(true);
    });
});
