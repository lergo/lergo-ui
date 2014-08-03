'use strict';

describe('Service: DisplayRoleService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mDisplayRoleService;
    beforeEach(inject(function (DisplayRoleService) {
        mDisplayRoleService = DisplayRoleService;
    }));

    it('should do something', function () {
        expect(!!mDisplayRoleService).toBe(true);
    });

});
