'use strict';

describe('Service: TagsService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mTagsService;
    beforeEach(inject(function (TagsService) {
        mTagsService = TagsService;
    }));

    it('should do something', function () {
        expect(!!mTagsService).toBe(true);
    });

});
