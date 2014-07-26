'use strict';

describe('Service: LikesService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var LikesService;
  beforeEach(inject(function (_LikesService_) {
    LikesService = _LikesService_;
  }));

  it('should do something', function () {
    expect(!!LikesService).toBe(true);
  });

});
