'use strict';

describe('Service: LessonsService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mLessonsService;
    beforeEach(inject(function (LessonsService) {
        mLessonsService = LessonsService;
    }));

    it('should do something', function () {
        expect(!!mLessonsService).toBe(true);
    });

});
