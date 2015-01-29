'use strict';

describe('Service: ReportsService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mReportsService;
    beforeEach(inject(function (ReportsService) {
        mReportsService = ReportsService;
    }));

    it('should do something', function () {
        expect(!!mReportsService).toBe(true);
    });

});
