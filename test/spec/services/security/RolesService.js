'use strict';

describe('Service: RolesService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mRolesService;
    beforeEach(inject(function (RolesService) {
        mRolesService = RolesService;
    }));

    it('should do something', function () {
        expect(!!mRolesService).toBe(true);
    });

});
