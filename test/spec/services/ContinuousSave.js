'use strict';

describe('Service: ContinuousSave', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mContinuousSave;
    beforeEach(inject(function (ContinuousSave) {
        mContinuousSave = ContinuousSave;
    }));

    it('should do something', function () {
        expect(!!mContinuousSave).toBe(true);
    });

});
