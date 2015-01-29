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

    it('should get media', function () {
        var media = mVideoService.getMedia('https://www.youtube.com/watch?v=heUd26tuinw');
        expect(media.type).toBe('youtube');
        expect(media.id).toBe('heUd26tuinw');


    });

    it('should support /embed/ urls from youtube', function () {
        var media = mVideoService.getMedia('http://www.youtube.com/embed/heUd26tuinw');
        expect(media.type).toBe('youtube');
        expect(media.id).toBe('heUd26tuinw');
    });

    it('should support vimeo urls', function () {
        var media = mVideoService.getMedia('http://vimeo.com/740052');
        expect(media.type).toBe('vimeo');
        expect(media.id).toBe('740052');
    });

    it('should return null for unknown urls', function(){
        expect(mVideoService.getMedia('http://gjkrgjrkgjkrjgkr')).toBe(null);
    });

});
