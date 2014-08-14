'use strict';

describe('Service: DisqusService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mDisqusService;
    beforeEach(inject(function (DisqusService) {
        mDisqusService = DisqusService;
    }));

    it('should do something', function () {
        expect(!!mDisqusService).toBe(true);
    });

});
