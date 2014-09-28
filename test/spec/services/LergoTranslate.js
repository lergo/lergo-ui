'use strict';

describe('Service: LergoTranslate', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mLergoTranslate;
    beforeEach(inject(function (LergoTranslate) {
        mLergoTranslate = LergoTranslate;
    }));

    it('should do something', function () {
        expect(!!mLergoTranslate).toBe(true);
    });

});
