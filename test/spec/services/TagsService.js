'use strict';

describe('Service: TagsService', function () {

    // load the service's module
    beforeEach(module('lergoRiApp'));

    // instantiate service
    var TagsService;
    beforeEach(inject(function (_TagsService_) {
        TagsService = _TagsService_;
    }));

    it('should do something', function () {
        expect(!!TagsService).toBe(true);
    });

});
