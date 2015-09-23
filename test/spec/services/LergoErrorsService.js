'use strict';

describe('Service: LergoErrorsService', function () {

  // load the service's module
  beforeEach(module('lergoApp'));

  // instantiate service
  var mLergoErrorsService;
  beforeEach(inject(function (LergoErrorsService) {
    mLergoErrorsService = LergoErrorsService;
  }));

  it('should do something', function () {
    expect(!!mLergoErrorsService).toBe(true);
  });

});
