'use strict';

describe('Service: FaqService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var FaqService;
    beforeEach(inject(function (_FaqsService_) {
        FaqService = _FaqsService_;
    }));

    it('should do something', function () {
        expect(!!FaqService).toBe(true);
    });

});
