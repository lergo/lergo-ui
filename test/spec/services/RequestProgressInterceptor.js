'use strict';

describe('Service: RequestProgressInterceptor', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mRequestProgressInterceptor;
    beforeEach(inject(function (RequestProgressInterceptor) {
        mRequestProgressInterceptor = RequestProgressInterceptor;
    }));

    it('should do something', function () {
        expect(!!mRequestProgressInterceptor).toBe(true);
    });

});
