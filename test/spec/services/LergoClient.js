'use strict';

describe('Service: LergoClient', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mLergoClient;
    beforeEach(inject(function (LergoClient) {
        mLergoClient = LergoClient;
    }));

    it('should do something', function () {
        expect(!!mLergoClient).toBe(true);
    });

});
