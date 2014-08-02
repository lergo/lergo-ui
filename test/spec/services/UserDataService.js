'use strict';

describe('Service: UserDataService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mUserDataService;
    beforeEach(inject(function (UserDataService) {
        mUserDataService = UserDataService;
    }));

    it('should do something', function () {
        expect(!!mUserDataService).toBe(true);
    });

});
