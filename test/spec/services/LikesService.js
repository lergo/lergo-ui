'use strict';

describe('Service: LikesService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mLikesService;
    beforeEach(inject(function (LikesService) {
        mLikesService = LikesService;
    }));

    it('should do something', function () {
        expect(!!mLikesService).toBe(true);
    });

});
