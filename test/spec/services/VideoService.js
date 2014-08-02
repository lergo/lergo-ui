'use strict';

describe('Service: VideoService', function () {

    // load the service's module
    beforeEach(module('lergoApp'));

    // instantiate service
    var mVideoService;
    beforeEach(inject(function (VideoService) {
        mVideoService = VideoService;
    }));

    it('should do something', function () {
        expect(!!mVideoService).toBe(true);
    });

});
