'use strict';

describe('Service: UsersService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mUsersService;
    beforeEach(inject(function (UsersService) {
        mUsersService = UsersService;
    }));

    it('should do something', function () {
        expect(!!mUsersService).toBe(true);
    });

});
