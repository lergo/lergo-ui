'use strict';

describe('Controller: LessonsIntroCtrl', function () {

    // load the controller's module
    beforeEach(module('lergoApp'));

    var LessonsIntroCtrl,
        scope;

    var getLessonIntroInvoked = false;
    var getPermissionsInvoked = false;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q) {
        scope = $rootScope.$new();
        LessonsIntroCtrl = $controller('LessonsIntroCtrl', {
            $scope: scope,
            LergoClient: {
                lessons: {
                    getLessonIntro: function () {
                        getLessonIntroInvoked = true;
                        return $q.defer().promise;
                    },
                    getPermissions: function(){
                        getPermissionsInvoked = true;
                        return $q.defer().promise;
                    }
                }
            }
        });
    }));

    it('should invoke getLessonIntroInvoked', function () {
        expect(getLessonIntroInvoked).toBe(true);
    });
    it('should invoke getPermissionsInvoked', function () {
        expect(getPermissionsInvoked).toBe(true);
    });
});
