'use strict';

describe('Service: RequestProgressMonitor', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mRequestProgressMonitor;
    beforeEach(inject(function (RequestProgressMonitor) {
        mRequestProgressMonitor = RequestProgressMonitor;
    }));

    it('should do something', function () {
        expect(!!mRequestProgressMonitor).toBe(true);
    });

});
