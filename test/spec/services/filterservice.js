'use strict';

describe('Service: FilterService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mFilterService;
    beforeEach(inject(function (FilterService) {
        mFilterService = FilterService;
    }));

    it('should do something', function () {
        expect(!!mFilterService).toBe(true);
    });

});
