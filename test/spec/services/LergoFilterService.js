'use strict';

describe('Service: LergoFilterService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mLergoFilterService;
    beforeEach(inject(function (LergoFilterService) {
        mLergoFilterService = LergoFilterService;
    }));

    it('should do something', function () {
        expect(!!mLergoFilterService).toBe(true);
    });

});
