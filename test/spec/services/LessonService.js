'use strict';

describe('Service: LessonService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mLessonService;
    beforeEach(inject(function (LessonService) {
        mLessonService = LessonService;
    }));

    it('should do something', function () {
        expect(!!mLessonService).toBe(true);
    });

});
