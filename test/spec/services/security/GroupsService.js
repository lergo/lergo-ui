'use strict';

describe('Service: GroupsService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mGroupsService;
    beforeEach(inject(function (GroupsService) {
        mGroupsService = GroupsService;
    }));

    it('should do something', function () {
        expect(!!mGroupsService).toBe(true);
    });

});
