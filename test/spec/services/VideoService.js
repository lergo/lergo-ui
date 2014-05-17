'use strict';

describe('Service: VideoService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var VideoService;
  beforeEach(inject(function (_VideoService_) {
    VideoService = _VideoService_;
  }));

  it('should do something', function () {
    expect(!!VideoService).toBe(true);
  });

});
