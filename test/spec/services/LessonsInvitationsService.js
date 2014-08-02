'use strict';

describe('Service: LessonsInvitationsService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mLessonsInvitationsService;
    beforeEach(inject(function (LessonsInvitationsService) {
        mLessonsInvitationsService = LessonsInvitationsService;
    }));

    it('should do something', function () {
        expect(!!mLessonsInvitationsService).toBe(true);
    });

});
